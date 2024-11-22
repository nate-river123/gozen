# service.py
import requests
from config import BASE_URL, AUTH_KEY

def post_logo_data(data):
    endpoint="v1/image/generation/create"
    url = f"{BASE_URL}/{endpoint}"  

    print(url)
    headers = {
        'Content-Type': 'application/json',
        'Authorization': AUTH_KEY
    }

    data = {
            "prompt" : data['field1'] + " " + data['field2'] + " " + data['field3'] + " " + data['field4'],
            "model_id": "0a99668b-45bd-4f7e-aa9c-f9aaa41ef13b"
            }

    # Sending a POST request
    response = requests.post(url, json=data, headers=headers)

    if response.status_code == 200:
        return response.json()
    else:
        return {"error": f"Failed with status code {response.status_code}"}
