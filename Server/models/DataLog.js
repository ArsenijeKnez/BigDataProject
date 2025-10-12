const mongoose = require("mongoose");

const dataLogSchema = new mongoose.Schema({
  deviceId: { type: String, required: true },
  payload: { type: Object, required: true },
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model("DataLog", dataLogSchema);
