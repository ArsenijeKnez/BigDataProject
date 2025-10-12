const DataLog = require("../models/DataLog");

exports.receiveData = async (req, res) => {
  try {
    const { deviceId, dataType, value } = req.body;

    if (!deviceId || !dataType || value === undefined)
      return res.status(400).json({ message: "Missing fields" });

    const entry = new DataLog({ deviceId, dataType, value });
    await entry.save();

    res.status(201).json({ message: "Data stored successfully", entry });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getAllData = async (req, res) => {
  try {
    const { deviceId, dataType } = req.query;
    const filter = {};

    if (deviceId) filter.deviceId = deviceId;
    if (dataType) filter.dataType = dataType;

    const logs = await DataLog.find(filter).sort({ timestamp: -1 });
    res.json(logs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
