from torchvision.transforms import functional as F
from PIL import Image
from transformers import BlipProcessor, BlipForConditionalGeneration
from flask import Flask, request, jsonify
import tempfile
import torch
import clip
from flask_cors import CORS


app = Flask(__name__)
CORS(app)

blip_processor = BlipProcessor.from_pretrained("Salesforce/blip-image-captioning-base")
blip_model = BlipForConditionalGeneration.from_pretrained("Salesforce/blip-image-captioning-base")

def analyze_road_damage(image_path):
    image = Image.open(image_path)
    model, preprocess = clip.load("ViT-B/32")
    image_cnn = preprocess(image).unsqueeze(0)
    text = clip.tokenize(["a photo of a road", "a photo of not a road"])

    with torch.no_grad():
        image_features = model.encode_image(image_cnn)
        text_features = model.encode_text(text)
        logits_per_image, _ = model(image_cnn, text)
        probs = logits_per_image.softmax(dim=-1).cpu().numpy()
    print(probs[0][0])
    if probs[0][0]<0.7:
        return {
            "damage_summary":"Not a road"
        }
    inputs = blip_processor(images=image, return_tensors="pt")
    output = blip_model.generate(**inputs)
    damage_summary = blip_processor.decode(output[0], skip_special_tokens=True)
    return {
        "damage_summary": damage_summary
    }

@app.route('/analyze', methods=['POST'])
def analyze():
    try:
        if 'image' not in request.files:
            return jsonify({"error": "No image file provided."}), 400
        file = request.files['image']  
              
        with tempfile.NamedTemporaryFile(suffix=".jpg", delete=False) as temp_file:
            file.save(temp_file.name)
            image_path = temp_file.name
        # Run analysis on the saved image
        report = analyze_road_damage(image_path)
        report.pop("_id",None)
        return jsonify(report)
    except Exception as e:
        # Log the error if needed and return a 500 response
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
	
	
