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

# Load env
load_dotenv()
mongo_uri = os.getenv("MONGO_URI_1")

# MongoDB setup
client = MongoClient(mongo_uri)
db = client["damage_reports"]
collection = db["reports"]

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

# CLIP model for road vs non-road
clip_model, clip_preprocess = clip.load("ViT-B/32", device="cpu")
clip_model.eval()

def serialize_report(report):
    report["_id"] = str(report["_id"])
    return report

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

    # Encode image to base64
    base64_image = base64.b64encode(image_data).decode("utf-8")

    # MongoDB insert
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

    return {
        "message": "✅ Report received successfully!",
        "report_id": str(result.inserted_id),
        "damage_type": readable_type,
        "severity": severity,
        "summary": summary,
        "status": "pending"
    }

@app.get("/reports/")
def get_all_reports():
    reports = list(collection.find().sort("created_at", -1))
    serialized = [serialize_report(report) for report in reports]
    return {"reports": serialized}

@app.get("/reports/{email}")
def get_reports_by_email(email: str):
    reports = list(collection.find({"email": email}).sort("created_at", -1))
    if not reports:
        raise HTTPException(status_code=404, detail="No reports found for this email.")
    serialized = [serialize_report(report) for report in reports]
    return {"reports": serialized}
#uvicorn main:app --host 0.0.0.0 --port 8000 --reload