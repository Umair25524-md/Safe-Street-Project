from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import torch
import clip
from PIL import Image
import io

app = FastAPI()

# CORS setup (allow all origins for dev purposes)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Replace with your frontend URL in production
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load CLIP model once on startup
model, preprocess = clip.load("ViT-B/32")
model.eval()

# ✅ Image classification route: checks if image is of a road
@app.post("/check-road/")
async def check_road(file: UploadFile = File(...)):
    contents = await file.read()
    image = Image.open(io.BytesIO(contents)).convert("RGB")
    image_input = preprocess(image).unsqueeze(0)
    text_inputs = clip.tokenize(["a photo of a road", "a photo of not a road"])

    with torch.no_grad():
        logits_per_image, _ = model(image_input, text_inputs)
        probs = logits_per_image.softmax(dim=-1).cpu().numpy()

    print("Probabilities:", probs)
    road_probability = float(probs[0][0])
    return {"road_probability": road_probability}



# ✅ Report damage route: receives form data including image, address, etc.
@app.post("/report-damage/")
async def report_damage(
    image: UploadFile = File(...),
    address: str = Form(...),
    landmark: str = Form(""),
    roadType: str = Form(""),
    comments: str = Form("")
):
    # Placeholder logic - you can save image or do classification here later
    print("📸 Image name:", image.filename)
    print("📍 Address:", address)
    print("🗺️ Landmark:", landmark)
    print("🛣️ Road Type:", roadType)
    print("📝 Comments:", comments)

    # Optional: Save image
    # with open(f"saved_images/{image.filename}", "wb") as f:
    #     f.write(await image.read())

    return {"message": "✅ Report received successfully!"}
