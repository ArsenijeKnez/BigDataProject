import requests
import random
import time
from datetime import datetime, timezone

DEVICE_URL = "http://localhost:4000/api/devices"
DATA_URL = "http://localhost:4000/api/data"

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


def should_send(device_type):
    for key, chance in SEND_CHANCES.items():
        if key in device_type:
            return random.random() < chance
    return random.random() < 0.5


def send_data(device):
    try:
        payload = {
            "deviceId": str(device["_id"]),
            "payload": generate_payload(device),
            "timestamp": datetime.now(timezone.utc).isoformat(),
        }

        res = requests.post(DATA_URL, json=payload, timeout=5)
        if res.status_code == 201:
            print(f"Sent data for {device['name']}: {payload}")
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

        if random.random() < 0.02:
            randomData = round(random.uniform(0, 1000), 2)
            send_data({"randomData": randomData})

        device = random.choice(devices)
        device_type = device.get("type", "").lower()

        if should_send(device_type):
            send_data(device)
        else:
            print(f"Skipped sending for {device['name']} ({device_type})")

        sleep_time = random.uniform(2, 6)
        time.sleep(sleep_time)
