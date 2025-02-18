import torch
import torchvision
from torchvision.transforms import functional as F
from PIL import Image
from ultralytics import YOLO
import cv2
import matplotlib.pyplot as plt
from transformers import BlipProcessor, BlipForConditionalGeneration
from flask import Flask, request, jsonify


def analyze_road_damage(image_path):
    # YOLOv8: Damage Detection
    yolo_model = YOLO("yolov8n.pt")
    results = yolo_model(image_path)

    damage_types = []
    for result in results:
        for box in result.boxes:
            cls = result.names[int(box.cls[0])]
            damage_types.append(cls)
    
    # Mask R-CNN: Size Estimation
    mask_rcnn = torchvision.models.detection.maskrcnn_resnet50_fpn(pretrained=True)
    mask_rcnn.eval()
    
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
    processor = BlipProcessor.from_pretrained("Salesforce/blip-image-captioning-base")
    blip_model = BlipForConditionalGeneration.from_pretrained("Salesforce/blip-image-captioning-base")
    
    inputs = processor(images=image, return_tensors="pt")
    output = blip_model.generate(**inputs)
    damage_summary = processor.decode(output[0], skip_special_tokens=True)

    return {
        "damage_types": damage_types,
        "damage_size": damage_size,
        "damage_summary": damage_summary
    }

# Run analysis
image_path = "C:\\Users\\viraj\\OneDrive\\Desktop\\Project-2-2\\Safe-Street-Project\\backend\\trial.jpg"
report = analyze_road_damage(image_path)
print(report)


app = Flask(__name__)

@app.route('/analyze', methods=['POST'])
def analyze():
    file = request.files['image']
    file.save("temp.jpg")  # Save uploaded image
    
    # Run analysis
    report = analyze_road_damage("temp.jpg")
    
    return jsonify(report)

if __name__ == '__main__':
    app.run(debug=True)