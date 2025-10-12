const mongoose = require("mongoose");

const deviceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String },
  location: { type: String },
  registeredAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Device", deviceSchema);
