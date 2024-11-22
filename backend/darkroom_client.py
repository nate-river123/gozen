from pathlib import Path
from typing import Any, Dict

import requests


class DarkroomConfig:
    def __init__(self, base_url: str, app_id: str):
        self.base_url = base_url
        self.app_id = app_id


class URLs:
    def __init__(
        self,
        upload_url: str,
        public_url: str,
        download_url: str,
        image_path: str,
    ):
        self.upload_url = upload_url
        self.public_url = public_url
        self.download_url = download_url
        self.image_path = image_path


class GetURLsResponse:
    def __init__(self, data: Dict[str, Any]):
        self.data = URLs(**data)


class DarkroomClient:
    def __init__(self, http_client: requests.Session, config: DarkroomConfig):
        self.http_client = http_client
        self.config = config

    def get_upload_url(self, filename: str) -> URLs:
        try:
            # Determine endpoint based on file extension
            ext = Path(filename).suffix
            url = f"{self.config.base_url}/v1/images/cloud_storage_url"
            if ext == ".mp4":
                url = f"{self.config.base_url}/v1/videos/cloud_storage_url"

            # Prepare request body
            body = {"file_name": filename}

            # Make the POST request
            headers = {"X-DARK-ROOM-APP-ID": self.config.app_id}
            response = self.http_client.post(url, json=body, headers=headers)

            # Handle response
            if response.status_code == 200:
                response_data = response.json()
                return GetURLsResponse(response_data["data"]).data
            else:
                error_body = response.text
                raise Exception(f"Received error from darkroom: {error_body}")

        except Exception as e:
            raise Exception(f"Error occurred in get_upload_url: {str(e)}")
