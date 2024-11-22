import json

import requests


class KVCreationClient:
    def __init__(self, base_url, headers=None):
        """Initialize the client with the base URL and headers."""
        self.base_url = base_url
        self.headers = headers if headers else {}

    def create_kv(self, payload):
        """Send a POST request to create a KV using the provided data."""
        url = f"{self.base_url}/internal/v1/kv"
        response = requests.post(url, headers=self.headers, data=json.dumps(payload))

        if response.status_code == 200:
            return response.json()
        else:
            response.raise_for_status()
