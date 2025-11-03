import requests
import random
import time
import os
import base64
from datetime import datetime, timezone

DEVICE_URL = "http://localhost:4000/api/devices"
DATA_URL = "http://localhost:4000/api/data"
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
IMAGE_FOLDER = os.path.join(BASE_DIR, "images")

SEND_CHANCES = {
    "temp": 0.8,
    "hum": 0.7,
    "noise": 0.6,
    "light": 0.75,
    "motion": 0.05,
}

DEVICE_REFRESH_INTERVAL = 60


def generate_payload(device):
    device_type = device.get("type", "").lower()

    if "motion" in device_type:
        image_files = [f for f in os.listdir(IMAGE_FOLDER) if f.lower().endswith((".jpg", ".jpeg", ".png"))]
        if image_files:
            image_path = os.path.join(IMAGE_FOLDER, random.choice(image_files))
            with open(image_path, "rb") as img_file:
                encoded_image = base64.b64encode(img_file.read()).decode("utf-8")
            return {
                "motion_detected": True,
                "image": encoded_image,
                "image_name": os.path.basename(image_path),
            }
        else:
            return {"motion_detected": True}

    if "temp" in device_type:
        return {"temperature": round(random.uniform(18, 35), 2)}
    elif "hum" in device_type:
        return {"humidity": round(random.uniform(30, 90), 2)}
    elif "noise" in device_type:
        return {"noise": round(random.uniform(40, 100), 2)}
    elif "motion" in device_type:
        return {"motion_detected": random.choice([True, False])}
    elif "light" in device_type:
        return {"luminosity": round(random.uniform(100, 800), 2)}

  
    # if random.random() < 0.2: 
    #     image_payload = select_random_image()
    #     if image_payload:
    #         return image_payload

    return {"value": round(random.uniform(0, 100), 2)}


def select_random_image():
    if not os.path.exists(IMAGE_FOLDER):
        return None

    images = [f for f in os.listdir(IMAGE_FOLDER) if f.lower().endswith((".png", ".jpg", ".jpeg"))]
    if not images:
        return None

    selected = random.choice(images)
    with open(os.path.join(IMAGE_FOLDER, selected), "rb") as img_file:
        encoded = base64.b64encode(img_file.read()).decode("utf-8")

    return {
        "type": "image",
        "fileName": selected,
        "format": selected.split(".")[-1],
        "imageData": encoded,
    }


def should_send(device_type):
    for key, chance in SEND_CHANCES.items():
        if key in device_type:
            return random.random() < chance
    return random.random() < 0.5


def send_data(device):
    try:
        payload = {
            "deviceId": str(device.get("_id", "unknown")),
            "payload": generate_payload(device),
            "timestamp": datetime.now(timezone.utc).isoformat(),
        }

        res = requests.post(DATA_URL, json=payload, timeout=10)
        if res.status_code == 201:
            print(f"Sent data for {device['name']}: {list(payload['payload'].keys())}")
        else:
            print(f"Failed for {device['name']} - {res.status_code}: {res.text}")
    except Exception as e:
        print(f"Error sending data for {device.get('name', 'Unknown')}: {e}")


def fetch_devices():
    try:
        res = requests.get(DEVICE_URL, timeout=5)
        if res.status_code == 200:
            devices = res.json()
            print(f"Found {len(devices)} devices.")
            return devices
        else:
            print("Could not fetch devices:", res.text)
            return []
    except Exception as e:
        print("Error fetching devices:", e)
        return []


if __name__ == "__main__":
    devices = fetch_devices()
    if not devices:
        print("No devices registered. Exiting.")
        exit(0)

    last_device_refresh = time.time()

    while True:
        if time.time() - last_device_refresh > DEVICE_REFRESH_INTERVAL:
            devices = fetch_devices()
            last_device_refresh = time.time()

        device = random.choice(devices)
        device_type = device.get("type", "").lower()

        if should_send(device_type):
            send_data(device)
        else:
            print(f"Skipped sending for {device['name']} ({device_type})")

        time.sleep(random.uniform(2, 6))
