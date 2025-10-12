const express = require("express");
const SensorData = require("../models/SensorData");

const router = express.Router();

// POST - upis senzorskih podataka
router.post("/", async (req, res) => {
  try {
    const data = new SensorData(req.body);
    await data.save();
    res.status(201).json({ message: "Data saved successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET - preuzimanje poslednjih N podataka
router.get("/", async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const data = await SensorData.find().sort({ timestamp: -1 }).limit(limit);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
