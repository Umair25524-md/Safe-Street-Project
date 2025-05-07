from flask import Flask, request, jsonify
from flask_cors import CORS
from torchvision.transforms import functional as F
from PIL import Image
from transformers import BlipProcessor, BlipForConditionalGeneration
import tempfile
import torch
import clip
import pymongo
import os
import datetime

app = Flask(__name__)
CORS(app)

# MongoDB setup
client = pymongo.MongoClient("mongodb://localhost:27017/")
db = client["User_Safe_street"]
collection = db["reports"]

# Load BLIP & CLIP models
blip_processor = BlipProcessor.from_pretrained("Salesforce/blip-image-captioning-base")
blip_model = BlipForConditionalGeneration.from_pretrained("Salesforce/blip-image-captioning-base")
clip_model, clip_preprocess = clip.load("ViT-B/32")

def analyze_road_damage(image_path):
    image = Image.open(image_path).convert("RGB")
    image_cnn = clip_preprocess(image).unsqueeze(0)
    text = clip.tokenize(["a photo of a road", "a photo of not a road"])

    with torch.no_grad():
        image_features = clip_model.encode_image(image_cnn)
        text_features = clip_model.encode_text(text)
        logits_per_image, _ = clip_model(image_cnn, text)
        probs = logits_per_image.softmax(dim=-1).cpu().numpy()

    if probs[0][0] < 0.7:
        return {"damage_summary": "Not a road"}
    
    inputs = blip_processor(images=image, return_tensors="pt")
    output = blip_model.generate(**inputs)
    damage_summary = blip_processor.decode(output[0], skip_special_tokens=True)

    return {"damage_summary": damage_summary}

@app.route('/report-damage', methods=['POST'])
def report_damage():
    try:
        if 'image' not in request.files:
            return jsonify({"error": "No image file provided."}), 400

        # Extract file and form fields
        file = request.files['image']
        address = request.form.get('address')
        landmark = request.form.get('landmark')
        roadType = request.form.get('roadType')
        comments = request.form.get('comments')

        with tempfile.NamedTemporaryFile(suffix=".jpg", delete=False) as temp_file:
            file.save(temp_file.name)
            image_path = temp_file.name

        # Run the ML analysis
        report = analyze_road_damage(image_path)

        # Save to DB
        document = {
            "address": address,
            "landmark": landmark,
            "roadType": roadType,
            "comments": comments,
            "timestamp": datetime.datetime.utcnow(),
            "damage_summary": report["damage_summary"],
            "status":"unresolved"
        }

        collection.insert_one(document)

        # Optional: delete the temp image
        os.remove(image_path)

        return jsonify({"message": "Report saved successfully!", "analysis": report["damage_summary"]})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True,port=5001)
