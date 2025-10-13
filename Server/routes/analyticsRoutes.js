const express = require("express");
const router = express.Router();
const DataLog = require("../models/DataLog");

//Average temperature by device (Aggregation)
router.get("/avg-temperature", async (req, res) => {
  try {
    const results = await DataLog.aggregate([
      { $match: { "payload.temperature": { $exists: true } } },
      {
        $group: {
          _id: "$deviceId",
          avgTemperature: { $avg: "$payload.temperature" },
          count: { $sum: 1 },
        },
      },
      { $sort: { avgTemperature: -1 } },
    ]);
    res.json(results);
  } catch (err) {
    res.status(500).json({ message: "Aggregation failed", error: err.message });
  }
});

//Average temperature by device (MapReduce)
router.get("/mapreduce-temperature", async (req, res) => {
  try {
    const map = function () {
      if (this.payload.temperature)
        emit(this.deviceId, this.payload.temperature);
    };
    const reduce = function (key, values) {
      return Array.sum(values) / values.length;
    };

    const results = await DataLog.mapReduce({
      map,
      reduce,
      out: { inline: 1 },
    });

    res.json(results);
  } catch (err) {
    res.status(500).json({ message: "MapReduce failed", error: err.message });
  }
});

module.exports = router;
