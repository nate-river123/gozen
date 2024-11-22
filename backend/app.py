from flask import Flask, request, jsonify
from flask_cors import CORS
from io import BytesIO
import base64
from PIL import Image, ImageDraw, ImageFont
from api_service import post_logo_data

app = Flask(__name__)
CORS(app)


@app.route('/api/logo', methods=['POST'])
def generate_logo():
  
    # Extract JSON data from the request body
    data = request.get_json()

    # Ensure the required fields are present
    required_fields = ['field1', 'field2', 'field3', 'field4']
    if not all(field in data for field in required_fields):
        return jsonify({"error": "Missing required fields"}), 400

     # Make the POST request via the service
    response = post_logo_data(data)
    return response

@app.route('/api/banner', methods=['POST'])
def generate_banner():
    text = request.json.get('text', 'Default Banner')
    banner = create_image(text, size=(800, 400))
    return jsonify({"banner": banner})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001)

