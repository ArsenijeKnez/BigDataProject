import requests
import random
import time
from datetime import datetime

DEVICE_URL = "http://localhost:4000/api/devices"
DATA_URL = "http://localhost:4000/api/data"

def generate_payload(device):
    device_type = device.get("type", "").lower()

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

    return {"value": round(random.uniform(0, 100), 2)}

def send_data(device):
    payload = {
        "deviceId": str(device["_id"]),
        "payload": generate_payload(device),
        "timestamp": datetime.utcnow().isoformat(),
    }

    try:
        res = requests.post(DATA_URL, json=payload)
        if res.status_code == 201:
            print(f"Sent data for {device['name']}: {payload}")
        else:
            print(f"Failed for {device['name']} - {res.status_code}: {res.text}")
    except Exception as e:
        print("Error sending data:", e)

def fetch_devices():
    try:
        res = requests.get(DEVICE_URL)
        if res.status_code == 200:
            devices = res.json()
            print(f"🔍 Found {len(devices)} devices.")
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

    while True:
        device = random.choice(devices)
        send_data(device)
        time.sleep(2)
