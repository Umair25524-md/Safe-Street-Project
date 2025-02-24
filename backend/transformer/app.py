import torch
import torchvision
from torchvision.transforms import functional as F
from PIL import Image
from ultralytics import YOLO
from transformers import BlipProcessor, BlipForConditionalGeneration
from flask import Flask, request, jsonify
from pymongo import MongoClient
import datetime
import tempfile
from flask_cors import CORS

# MongoDB setup
client = MongoClient("mongodb://localhost:27017/")
db = client["road_damage_db"]
collection = db["damage_reports"]
# Enable CORS


app = Flask(__name__)
CORS(app)

# Load models once at startup
yolo_model = YOLO("yolov8n.pt")
mask_rcnn = torchvision.models.detection.maskrcnn_resnet50_fpn(pretrained=True)
mask_rcnn.eval()
blip_processor = BlipProcessor.from_pretrained("Salesforce/blip-image-captioning-base")
blip_model = BlipForConditionalGeneration.from_pretrained("Salesforce/blip-image-captioning-base")

def analyze_road_damage(image_path):
    # YOLOv8: Damage Detection
    results = yolo_model(image_path)
    damage_types = []
    for result in results:
        for box in result.boxes:
            cls = result.names[int(box.cls[0])]
            damage_types.append(cls)
    
    # Mask R-CNN: Size Estimation
    image = Image.open(image_path)
    image_tensor = F.to_tensor(image).unsqueeze(0)
    with torch.no_grad():
        predictions = mask_rcnn(image_tensor)
    
    masks = predictions[0]["masks"]
    scores = predictions[0]["scores"]
    threshold = 0.8
    valid_masks = [masks[i] for i in range(len(scores)) if scores[i] > threshold]
    damage_size = sum((mask > 0.5).sum().item() for mask in valid_masks)
    
    # BLIP: Text Summary
    inputs = blip_processor(images=image, return_tensors="pt")
    output = blip_model.generate(**inputs)
    damage_summary = blip_processor.decode(output[0], skip_special_tokens=True)
    
    return {
        "damage_types": damage_types,
        "damage_size": damage_size,
        "damage_summary": damage_summary
    }

@app.route('/analyze', methods=['POST'])
def analyze():
    try:
        # Ensure image file is provided
        if 'image' not in request.files:
            return jsonify({"error": "No image file provided."}), 400
        
        file = request.files['image']
        location = request.form.get('location')
        date_str = request.form.get('date')
        reporter_id = request.form.get('reporter_id')
        
        # Check for required form fields
        if not all([location, date_str, reporter_id]):
            return jsonify({"error": "Missing required form data (location, date, reporter_id)."}), 400
        
        # Parse the date (expected format: YYYY-MM-DD)
        try:
            date = datetime.datetime.strptime(date_str, "%Y-%m-%d")
        except ValueError:
            return jsonify({"error": "Date format should be YYYY-MM-DD."}), 400
        
        # Save the uploaded image to a unique temporary file
        with tempfile.NamedTemporaryFile(suffix=".jpg", delete=False) as temp_file:
            file.save(temp_file.name)
            image_path = temp_file.name
        
        # Run analysis on the saved image
        report = analyze_road_damage(image_path)
        
        # Add additional metadata to the report
        report["location"] = location
        report["date"] = date
        report["reporter_id"] = reporter_id
        
        # Save the report to MongoDB
        collection.insert_one(report)
        
        return jsonify(report)
    except Exception as e:
        # Log the error if needed and return a 500 response
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)