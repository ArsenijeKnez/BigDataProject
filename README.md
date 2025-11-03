# IoT Logger

A full-stack **IoT monitoring and analytics platform** developed as part of the *Big Data u infrastrukturnim sistemima* course at **FTN Novi Sad**.
The system simulates sensor data, processes it in real time, stores it in the cloud, and provides analytics through a modern web interface.

---

## Project Overview

The **IoT Logger** project consists of four main components:

1. **Python Simulator**
   Generates simulated IoT sensor data (temperature, humidity, motion, etc.) and sends it to the server over HTTP or MQTT.

2. **Express.js Server (Node.js)**
   Handles incoming data, stores it in **MongoDB Atlas**, indexes analytics data in **Elasticsearch**, and exposes REST API endpoints for the frontend.

3. **React UI**
   Displays live data streams, charts, and analytics dashboards. Fetches processed data from the Express API.

4. **Dockerized Elasticsearch**
   Elasticsearch runs in isolated Docker containers for easy deployment.

---

## 🧩 Architecture Diagram

```
+------------------+          +----------------+          +-------------------+
|  Python Simulator|  --->    | Express Server |  --->    | MongoDB & Elastic |
+------------------+          +----------------+          +-------------------+
                                      |
                                      v
                               +---------------+
                               |   React UI    |
                               +---------------+
```


## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/ArsenijeKnez/iot-logger.git
cd iot-logger
```

### 2. Environment Variables

Create a `.env` file in the `server/` directory with:

```
MONGO_URI=<your-mongodb-atlas-uri>
ELASTIC_URL=http://localhost:9200
PORT=5000
```

### 3. Build and Run ElasticSearch with Docker

```bash
docker run -d \
  --name elasticsearch \
  -p 9200:9200 \
  -p 9300:9300 \
  -e "discovery.type=single-node" \
  -e "xpack.security.enabled=false" \
  docker.elastic.co/elasticsearch/elasticsearch:8.15.0
```

### 4. After ES start the services in this order
Server
```bash
node index.js
```
Simulator
```bash
python simulator.py
```
UI
```bash
npm start
```
