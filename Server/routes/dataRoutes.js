const express = require("express");
const router = express.Router();
const DataLog = require("../models/DataLog");
const Device = require("../models/Device");
const MiscellaneousData = require("../models/MiscellaneousData.js");
const { indexSensorData } = require("../services/elasticSync");

//log new data
const fs = require("fs");
const path = require("path");

router.post("/", async (req, res) => {
  try {
    const data = req.body;
    const receivedTimestamp = new Date();
    const sourceAddress = req.ip || req.socket?.remoteAddress;

    const isValid =
      typeof data === "object" &&
      data !== null &&
      "deviceId" in data &&
      "payload" in data &&
      "timestamp" in data;

    const dataSize = Buffer.byteLength(JSON.stringify(data));

    if (isValid) {
      const { deviceId, payload, timestamp } = data;

      const device = await Device.findById(deviceId);
      if (!device) {
        return res.status(404).json({ error: "Device not found" });
      }

      let imageUrl = null;
      if (payload.image && payload.image_name) {
        const imageBuffer = Buffer.from(payload.image, "base64");
        const uploadDir = path.join(__dirname, "../uploads");

        if (!fs.existsSync(uploadDir))
          fs.mkdirSync(uploadDir, { recursive: true });

        const filePath = path.join(uploadDir, payload.image_name);
        fs.writeFileSync(filePath, imageBuffer);

        imageUrl = `/uploads/${payload.image_name}`;
        payload.imageUrl = imageUrl;
        delete payload.image;
      }

      const newLog = new DataLog({
        deviceId,
        payload,
        dataSize,
        timestamp,
        receivedTimestamp,
      });

      await newLog.save();

      await indexSensorData({
        deviceId,
        timestamp,
        ...payload,
      });

      return res.status(201).json({
        message: "Data logged successfully",
        log: newLog,
      });
    }

    const miscLog = new MiscellaneousData({
      receivedTimestamp,
      sourceAddress,
      payload: data,
      dataSize,
    });

    await miscLog.save();

    res.status(202).json({
      message: "Data stored as miscellaneous (invalid format)",
      miscLog,
    });
  } catch (err) {
    console.error("Error logging data:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

//Get recent logs
router.get("/recent", async (req, res) => {
  try {
    const logs = await DataLog.find().sort({ timestamp: -1 }).limit(20);
    res.json(logs);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch logs", error: err.message });
  }
});

module.exports = router;
