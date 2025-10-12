const mongoose = require("mongoose");

const sensorDataSchema = new mongoose.Schema({
  sensor_id: String,
  timestamp: { type: Date, default: Date.now },
  value: Number,
  unit: String,
  location: String,
});

module.exports = mongoose.model("SensorData", sensorDataSchema);
