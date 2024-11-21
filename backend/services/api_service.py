# service.py
import requests
from config import BASE_URL

def make_post_request(endpoint, data):
    url = f"{BASE_URL}/{endpoint}"  # Construct the full URL
    headers = {
        'Content-Type': 'application/json',
        # Add other headers as needed
    }

    # Sending a POST request
    response = requests.post(url, json=data, headers=headers)

    if response.status_code == 200:
        return response.json()
    else:
        return {"error": f"Failed with status code {response.status_code}"}
