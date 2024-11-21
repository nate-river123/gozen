from flask import Flask, request, jsonify
from flask_cors import CORS
from io import BytesIO
import base64
from PIL import Image, ImageDraw, ImageFont

app = Flask(__name__)
CORS(app)

def create_image(text, size=(400, 200), background="white"):
    image = Image.new("RGB", size, color=background)
    draw = ImageDraw.Draw(image)
    font = ImageFont.load_default()
    
    # Get text size using textbbox() instead of textsize()
    bbox = draw.textbbox((0, 0), text, font=font)
    w, h = bbox[2] - bbox[0], bbox[3] - bbox[1]
    
    draw.text(((size[0]-w)/2, (size[1]-h)/2), text, fill="black", font=font)
    
    buffer = BytesIO()
    image.save(buffer, format="PNG")
    buffer.seek(0)
    return base64.b64encode(buffer.read()).decode()

@app.route('/api/logo', methods=['POST'])
def generate_logo():
    text = request.json.get('text', 'Default Logo')
    logo = create_image(text, size=(300, 100))
    return jsonify({"logo": logo})

@app.route('/api/banner', methods=['POST'])
def generate_banner():
    text = request.json.get('text', 'Default Banner')
    banner = create_image(text, size=(800, 400))
    return jsonify({"banner": banner})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001)

