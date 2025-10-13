const express = require("express");
const router = express.Router();
const DataLog = require("../models/DataLog");
const Device = require("../models/Device");
const { indexSensorData } = require("../services/elasticSync");

//Log new data from a device
router.post("/", async (req, res) => {
  try {
    const { deviceId, payload } = req.body;

    const device = await Device.findById(deviceId);
    if (!device) {
      return res.status(404).json({ error: "Device not found" });
    }

    const newLog = new DataLog({ deviceId, payload });
    await newLog.save();

    await indexSensorData({
      deviceId,
      timestamp: newLog.timestamp,
      ...payload,
    });

    res.status(201).json({ message: "Data logged successfully", log: newLog });
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
