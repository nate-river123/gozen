from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
from config import STABLECOG_URL, AUTH_TOKEN, LOGO_DIMENSIONS, BANNER_DIMENSIONS, MODEL_MAP  # Import models

app = Flask(__name__)
CORS(app)


def generate_image_response(prompt, width, height):
    """
    Handles the StableCog API call and returns URLs based on the provided prompt, size, and model.

    Args:
        prompt (str): The AI prompt describing the image.
        width (int): The width of the image.
        height (int): The height of the image.

    Returns:
        dict: A dictionary containing the list of image URLs.
    """
    headers = {
        "Authorization": f"Bearer {AUTH_TOKEN}",
        "Content-Type": "application/json"
    }

    payload = {
        "prompt": prompt,
        "model_id": MODEL_MAP["Stable Diffusion 3"],  # Default to FLUX.1 if not specified
        "num_outputs": 3,
        "width": width,
        "height": height
    }

    try:
        response = requests.post(STABLECOG_URL, json=payload, headers=headers)
        response.raise_for_status()
        return extract_image_urls(response.json())
    except requests.RequestException as e:
        # Log error and return empty URLs in case of failure
        print(f"Error during StableCog API call: {e}")
        return {"urls": []}


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
    result = generate_image_response(prompt, **LOGO_DIMENSIONS)

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
    result = generate_image_response(prompt, **BANNER_DIMENSIONS)

    return jsonify(result)


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001)
