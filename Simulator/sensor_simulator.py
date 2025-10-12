import requests
import random
import time
from datetime import datetime

URL = "http://localhost:4000/api/sensors"

SENSORS = [
    {"id": "temp_001", "unit": "°C", "location": "Novi Sad"},
    {"id": "hum_002", "unit": "%", "location": "Beograd"},
    {"id": "noise_003", "unit": "dB", "location": "Niš"}
]

def send_data():
    sensor = random.choice(SENSORS)
    value = round(random.uniform(15, 35), 2)
    payload = {
        "sensor_id": sensor["id"],
        "timestamp": datetime.utcnow().isoformat(),
        "value": value,
        "unit": sensor["unit"],
        "location": sensor["location"]
    }
    try:
        requests.post(URL, json=payload)
        print(f"Sent: {payload}")
    except Exception as e:
        print("Error sending data:", e)

if __name__ == "__main__":
    while True:
        send_data()
        time.sleep(2) 
