from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import torch
import clip
from PIL import Image
import io

app = FastAPI()

# CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

model, preprocess = clip.load("ViT-B/32")
model.eval()

@app.post("/check-road/")
async def check_road(file: UploadFile = File(...)):
    contents = await file.read()
    image = Image.open(io.BytesIO(contents)).convert("RGB")
    image_input = preprocess(image).unsqueeze(0)

    text_inputs = clip.tokenize(["a photo of a road", "a photo of not a road"])

    with torch.no_grad():
        logits_per_image, _ = model(image_input, text_inputs)
        probs = logits_per_image.softmax(dim=-1).cpu().numpy()

    road_probability = float(probs[0][0])
    return {"road_probability": road_probability}
