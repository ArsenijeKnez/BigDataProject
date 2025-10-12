const Device = require("../models/Device");

exports.registerDevice = async (req, res) => {
  try {
    const { name, type, location } = req.body;

    const device = new Device({ name, type, location });
    await device.save();

    res.status(201).json({ message: "Device registered", device });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getDevices = async (req, res) => {
  try {
    const devices = await Device.find().sort({ registeredAt: -1 });
    res.json(devices);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
