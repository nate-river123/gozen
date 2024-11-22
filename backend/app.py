from flask import Flask, request, jsonify
from flask_cors import CORS
from concurrent.futures import ThreadPoolExecutor
import requests
from config import (
    STABLECOG_URL,
    AUTH_TOKEN,
    LOGO_DIMENSIONS,
    BANNER_DIMENSIONS,
    MODEL_MAP,
    UPLOAD_FOLDER,
    ALLOWED_EXTENSIONS,
    DARKROOM_BASE_URL,
    DARKROOM_APP_ID,
    KV_BASE_URL,
    KV_HEADERS,
    PARALLEL_CALLS,
)
import base64
import os
from io import BytesIO

from darkroom_client import DarkroomClient, DarkroomConfig
from kv_creation import KVCreationClient
from PIL import Image, ImageDraw, ImageFont
from werkzeug.utils import secure_filename

app = Flask(__name__)
CORS(app)

# Set upload folder and allowed extensions
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER

if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

def allowed_file(filename):
    """Check if the uploaded file's extension is allowed."""
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS

def create_image(text, size=(400, 200), background="white"):
    """Create an image with the given text."""
    image = Image.new("RGB", size, color=background)
    draw = ImageDraw.Draw(image)
    font = ImageFont.load_default()

    # Get text size using textbbox() instead of textsize()
    bbox = draw.textbbox((0, 0), text, font=font)
    w, h = bbox[2] - bbox[0], bbox[3] - bbox[1]

    draw.text(((size[0] - w) / 2, (size[1] - h) / 2), text, fill="black", font=font)

    buffer = BytesIO()
    image.save(buffer, format="PNG")
    buffer.seek(0)
    return base64.b64encode(buffer.read()).decode()

def generate_image_response(prompt, parallel, width, height):
    """
    Handles parallel StableCog API calls and returns URLs based on the provided prompt, size, and model.

    Args:
        prompt (str): The AI prompt describing the image.
        width (int): The width of the image.
        height (int): The height of the image.
        parallel (int): Number of parallel API calls to make.

    Returns:
        dict: A dictionary containing the list of image URLs.
    """
    headers = {
        "Authorization": f"Bearer {AUTH_TOKEN}",
        "Content-Type": "application/json",
    }

    payload = {
        "prompt": prompt,
        "model_id": MODEL_MAP["Stable Diffusion 3"],  # Default to Stable Diffusion 3
        "num_outputs": 1,  # Each API call generates one image
        "width": width,
        "height": height,
    }

    def make_request():
        try:
            response = requests.post(STABLECOG_URL, json=payload, headers=headers)
            response.raise_for_status()
            data = response.json()
            return extract_image_urls(data)["urls"]
        except requests.RequestException as e:
            print(f"Error during StableCog API call: {e}")
            return []

    urls = []
    with ThreadPoolExecutor(max_workers=parallel) as executor:
        futures = [executor.submit(make_request) for _ in range(parallel)]
        for future in futures:
            urls.extend(future.result())

    return {"urls": urls}

def extract_image_urls(response_data):
    """
    Extracts image URLs from the StableCog API response.

    Args:
        response_data (dict): The response object from the StableCog API.

    Returns:
        dict: A dictionary containing the list of URLs.
    """
    try:
        outputs = response_data.get("outputs", [])
        urls = [output.get("url") for output in outputs if output.get("url")]
        # if urls:
        #     urls = urls * 3
        return {"urls": urls}
    except Exception:
        return {"urls": []}

@app.route('/api/logo', methods=['POST'])
def generate_logo():
    """
    Generate a logo based on the brand name and best-selling item.
    """
    data = request.json
    brand_name = data.get('brand_name', 'Default Brand')
    best_seller_item = data.get('best_seller_item', 'Default Item')

    # Construct the prompt
    prompt = f"Create a logo for the brand '{brand_name}' featuring its name and its best-selling food item: '{best_seller_item}'."

    # Call the helper function with dimensions from config
    result = generate_image_response(prompt, PARALLEL_CALLS, **LOGO_DIMENSIONS)

    return jsonify(result)

@app.route('/api/banner', methods=['POST'])
def generate_banner():
    """
    Generate a banner based on the brand name, tagline, and offer.
    """
    data = request.json
    brand_name = data.get('brand_name', 'Default Brand')
    tagline = data.get('tagline', 'Default Tagline')
    offer = data.get('offer', 'Default Offer')

    # Construct the prompt
    prompt = f"Banner for the brand '{brand_name}', with tagline: '{tagline}' and offer: '{offer}'."

    # Call the helper function with dimensions from config
    result = generate_image_response(prompt, PARALLEL_CALLS, **BANNER_DIMENSIONS)

    return jsonify(result)

@app.route("/api/ad-banner", methods=["POST"])
def upload_ad_banner():
    """Handle ad banner upload and upload the file to the Darkroom upload_url."""
    # Check for form data
    brand_name = request.form.get("brand_name")
    discount = request.form.get("discount")
    file = request.files.get("image")

    if not brand_name or not discount or not file:
        return jsonify({"error": "Missing required fields"}), 400

    # Validate file
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        file_path = os.path.join(app.config["UPLOAD_FOLDER"], filename)
        file.save(file_path)

        try:
            # Use DarkroomClient to get an upload URL
            urls = client.get_upload_url(filename)

            # Upload the file to the upload_url
            with open(file_path, "rb") as image_file:
                response = requests.put(
                    urls.upload_url,
                    data=image_file,
                    headers={"Content-Type": "image/png"},
                )

            if response.status_code == 200:

                kv_payload = {
                    "color": "image-based",
                    "image_url": urls.public_url,  # Use the URL of the uploaded image
                    "kv_name_suffix": "variant_2",
                    "outlet_name": brand_name,
                    "restaurant_info": {
                        "location_tag_title": "Terdekat",
                        "review_tag_title": "4.6",
                        "social_proof_tag_title": "Dipesan 100+ kali",
                    },
                    "template_id": 7,
                    "text": "Harganya pas, rasanya kelas",
                    "promo_details": {
                        "promo_type": "markdown_cart_percentage_promo",
                        "discount": int(discount),
                        "min_order_amount": 800000,
                        "max_discount_amount": 36000,
                    },
                }

                # Make the KV creation request
                try:
                    kv_response = kv_client.create_kv(kv_payload)

                    print(kv_response)
                    return jsonify(
                        {
                            "urls": [
                                kv_response["data"],
                                kv_response["data"],
                                kv_response["data"],
                            ],
                        }
                    )
                except requests.exceptions.HTTPError as kv_error:
                    return jsonify({"error": f"Failed to create KV: {kv_error}"}), 500
            else:
                print(response.text)
                return jsonify({"error": "Failed to upload file to Darkroom."}), 500

        except Exception as e:
            return jsonify({"error": str(e)}), 500

    return jsonify({"error": "Invalid file type"}), 400

if __name__ == "__main__":
    config = DarkroomConfig(
        base_url=DARKROOM_BASE_URL,
        app_id=DARKROOM_APP_ID,
    )
    session = requests.Session()
    client = DarkroomClient(http_client=session, config=config)

    kv_client = KVCreationClient(
        base_url=KV_BASE_URL,
        headers=KV_HEADERS,
    )
    app.run(host="0.0.0.0", port=5001)
