const express = require("express");
const router = express.Router();
const Device = require("../models/Device");
const { indexSensorData } = require("../services/elasticSync");

//Register a new device
router.post("/register", async (req, res) => {
  try {
    const { name, type, location } = req.body;

    const newDevice = new Device({ name, type, location });
    await newDevice.save();

    await indexSensorData({
      deviceId: newDevice._id,
      name,
      type,
      location,
      registeredAt: newDevice.registeredAt,
    });

    res.status(201).json({
      message: "Device registered successfully",
      device: newDevice,
    });
  } catch (error) {
    console.error("Error registering device:", error);
    res.status(500).json({ error: "Failed to register device" });
  }
});

//All registered devices
router.get("/", async (req, res) => {
  try {
    const devices = await Device.find();
    res.json(devices);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch devices" });
  }
});

module.exports = router;
