from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from PIL import Image
import io, os, base64, torch, json
from datetime import datetime
from transformers import ViTImageProcessor, ViTForImageClassification, BartTokenizer, BartForConditionalGeneration
from huggingface_hub import hf_hub_download
from pymongo import MongoClient
from dotenv import load_dotenv
import clip
from bson import ObjectId
from fastapi import Body

# Load environment variables
load_dotenv()
mongo_uri = os.getenv("MONGO_URI_1")

# MongoDB setup
client = MongoClient(mongo_uri)
db = client["damage_reports"]
collection = db["reports"]

notifications_collection = db["admin_notifications"]


# FastAPI setup
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Device setup
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# Model repo IDs
vit_repo = "Rayan360/final_road_damage_model"
bart_repo = "Rayan360/bart-summary-final"

# Load ViT model & processor
vit_model = ViTForImageClassification.from_pretrained(vit_repo).to(device)
vit_processor = ViTImageProcessor.from_pretrained(vit_repo)

# Load BART model & tokenizer
bart_model = BartForConditionalGeneration.from_pretrained(bart_repo).to(device)
bart_tokenizer = BartTokenizer.from_pretrained(bart_repo)

# Load class names
class_names_path = hf_hub_download(repo_id=vit_repo, filename="class_names.json")
with open(class_names_path, "r") as f:
    class_names = json.load(f)

# Damage type mapping
damage_type_map = {
    "D00": "Longitudinal Crack",
    "D10": "Transverse Crack",
    "D20": "Alligator Crack",
    "D40": "Pothole"
}

# Load CLIP model for road detection
clip_model, clip_preprocess = clip.load("ViT-B/32", device="cpu")
clip_model.eval()

# Utility to serialize MongoDB ObjectId
def serialize_report(report):
    report["_id"] = str(report["_id"])
    return report

# Endpoint: Check if image is road or not using CLIP
@app.post("/check-road/")
async def check_road(file: UploadFile = File(...)):
    contents = await file.read()
    image = Image.open(io.BytesIO(contents)).convert("RGB")

    image_input = clip_preprocess(image).unsqueeze(0).to("cpu")
    text_inputs = clip.tokenize(["a photo of a road", "a photo of not a road"]).to("cpu")

    with torch.no_grad():
        logits_per_image, _ = clip_model(image_input, text_inputs)
        probs = logits_per_image.softmax(dim=-1).cpu().numpy()

    road_probability = float(probs[0][0])
    return {"road_probability": road_probability}

# Endpoint: Submit damage report
@app.post("/report-damage/")
async def report_damage(
    image: UploadFile = File(...),
    address: str = Form(...),
    comments: str = Form(""),
    email: str = Form(...),
    submission_date: str = Form(...)
):
    try:
        image_data = await image.read()
        pil_image = Image.open(io.BytesIO(image_data)).convert("RGB")
    except Exception as e:
        return JSONResponse(status_code=400, content={"error": f"Invalid image: {str(e)}"})

    # ViT Prediction
    vit_inputs = vit_processor(images=pil_image, return_tensors="pt").to(device)
    with torch.no_grad():
        vit_outputs = vit_model(**vit_inputs)
    pred_class = torch.argmax(vit_outputs.logits, dim=1).item()
    label = class_names[pred_class] if pred_class < len(class_names) else "Unknown"

    try:
        code, severity = label.split("_")
    except Exception:
        code, severity = "Unknown", "Unknown"

    readable_type = damage_type_map.get(code, "Unknown Damage Type")
    summary_input = f"{code} - {severity}"

    # BART Summary generation
    inputs = bart_tokenizer(f"summarize: {summary_input}", return_tensors="pt", max_length=64, truncation=True).to(device)
    with torch.no_grad():
        summary_ids = bart_model.generate(**inputs, max_length=64)
    summary = bart_tokenizer.decode(summary_ids[0], skip_special_tokens=True)

    # Encode image
    base64_image = base64.b64encode(image_data).decode("utf-8")

    # Save to MongoDB
    report = {
        "damage_type": readable_type,
        "severity": severity,
        "summary": summary,
        "address": address,
        "comments": comments,
        "email": email,
        "submission_date": submission_date,
        "status": "pending",
        "image_base64": base64_image,
        "image_type": image.content_type,
        "image_filename": image.filename,
        "created_at": datetime.utcnow()
    }

    result = collection.insert_one(report)

    # Save a new admin notification
    notifications_collection.insert_one({
        "email": email,
        "report_id": str(result.inserted_id),
        "address": address,
        "damage_type": readable_type,
        "severity": severity,
        "summary": summary,
        "is_read": False,
        "created_at": datetime.utcnow()
    })


    return {
        "message": "✅ Report received successfully!",
        "report_id": str(result.inserted_id),
        "damage_type": readable_type,
        "severity": severity,
        "summary": summary,
        "status": "pending"
    }

# Endpoint: Get all reports (Admin)
@app.get("/reports/")
def get_all_reports():
    reports = list(collection.find().sort("created_at", -1))
    serialized = [serialize_report(report) for report in reports]
    return {"reports": serialized}

# Endpoint: Get user-specific reports by email
@app.get("/reports/{email}")
def get_reports_by_email(email: str):
    reports = list(collection.find({"email": email}).sort("created_at", -1))
    if not reports:
        raise HTTPException(status_code=404, detail="No reports found for this email.")
    serialized = [serialize_report(report) for report in reports]
    return {"reports": serialized}

# ✅ Endpoint: Update status (Resolved, etc.)
@app.put("/report-status/{report_id}")
async def update_report_status(report_id: str, new_status: str = Form(...)):
    try:
        result = collection.update_one(
            {"_id": ObjectId(report_id)},
            {"$set": {"status": new_status}}
        )
        if result.modified_count == 0:
            raise HTTPException(status_code=404, detail="Report not found or status unchanged.")
        return {"message": f"✅ Status updated to '{new_status}'"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ✅ Endpoint: Delete report
@app.delete("/reports/{report_id}")
async def delete_report(report_id: str):
    result = collection.delete_one({"_id": ObjectId(report_id)})
    if result.deleted_count == 1:
        return {"message": "Report deleted successfully"}
    else:
        raise HTTPException(status_code=404, detail="Report not found")
    
@app.patch("/reports/{report_id}")
async def patch_report(report_id: str, update_data: dict = Body(...)):
    try:
        # Only allow specific fields to be updated (you can expand this list)
        allowed_fields = {"status"}

        # Filter incoming fields
        update_fields = {k: v for k, v in update_data.items() if k in allowed_fields}
        if not update_fields:
            return {"message": "No valid fields to update."}

        result = collection.update_one(
            {"_id": ObjectId(report_id)},
            {"$set": update_fields}
        )
        if result.matched_count == 0:
            return {"error": "Report not found."}
        if result.modified_count == 0:
            return {"message": "No changes made."}

        return {"message": "✅ Report updated successfully", "updated_fields": update_fields}
    except Exception as e:
        return {"error": str(e)}
    

@app.get("/admin-notifications/")
def get_admin_notifications():
    notifications = list(notifications_collection.find().sort("created_at", -1))
    for notif in notifications:
        notif["_id"] = str(notif["_id"])
    return {"notifications": notifications}


@app.delete("/admin-notifications/{notification_id}")
async def delete_admin_notification(notification_id: str):
    result = notifications_collection.delete_one({"_id": ObjectId(notification_id)})
    if result.deleted_count == 1:
        return {"message": "Notification deleted successfully"}
    else:
        raise HTTPException(status_code=404, detail="Notification not found")


# Run the server using:
# uvicorn main:app --host 0.0.0.0 --port 8000 --reload
