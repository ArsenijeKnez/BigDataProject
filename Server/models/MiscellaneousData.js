const mongoose = require("mongoose");

const MiscellaneousDataSchema = new mongoose.Schema({
  receivedTimestamp: {
    type: Date,
    required: true,
    default: Date.now,
  },
  sourceAddress: {
    type: String,
    required: false,
  },
  payload: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
  },
  dataSize: { type: Number, required: true },
});

module.exports = mongoose.model("MiscellaneousData", MiscellaneousDataSchema);
