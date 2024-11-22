# config.py

# StableCog API Configuration
STABLECOG_URL = "https://api.stablecog.com/v1/image/generation/create"
AUTH_TOKEN = "sc-6e8433aa4c1a85968764872b214fe94ac88ae4c014bf8c662cca859f38def9ad"  # Replace with your actual token

# Image dimensions
LOGO_DIMENSIONS = {"width": 1024, "height": 1024}  # Square logo
BANNER_DIMENSIONS = {"width": 1024, "height": 682}  # 3:2 aspect ratio banner

# Model IDs
MODEL_MAP = {
    "FLUX.1": "0a99668b-45bd-4f7e-aa9c-f9aaa41ef13b",
    "Stable Diffusion 3": "986d447d-c38b-4218-a2c8-6e0b691f47ec",
    "Kandinsky 2.2": "9fa49c00-109d-430f-9ddd-449f02e2c71a",
    "SDXL": "8002bc51-7260-468f-8840-cf1e6dbe3f8a",
    "SSD-1B": "4e54440f-ee17-4712-b4b6-0671b94d685d",
    "Luna Diffusion": "b6c1372f-31a7-457c-907c-d292a6ffef97",
    "22h Diffusion": "fc06f6ab-ed14-4186-a7c0-aaec288d4f38",
    "Waifu Diffusion": "f7f3d973-ac6f-4a7a-9db8-e89e4fba03a9"
}
