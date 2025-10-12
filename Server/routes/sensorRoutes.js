const express = require("express");
const router = express.Router();
const DataLog = require("../models/DataLog");

router.post("/", async (req, res) => {
  try {
    const { deviceId, payload } = req.body;
    const entry = new DataLog({ deviceId, payload });
    await entry.save();
    res.status(201).json({ message: "Data logged successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

router.get("/recent", async (req, res) => {
  const logs = await DataLog.find().sort({ timestamp: -1 }).limit(20);
  res.json(logs);
});

module.exports = router;
