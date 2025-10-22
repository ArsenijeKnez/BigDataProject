const express = require("express");
const router = express.Router();
const DataLog = require("../models/DataLog");

//Average temperature by device
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

router.get("/data-volume", async (req, res) => {
  try {
    const { periodInHours } = req.body;
    if (!periodInHours || isNaN(periodInHours)) {
      return res
        .status(400)
        .json({ message: "periodInHours is required and must be a number" });
    }
    var dataVolume = {};
    for (var i = periodInHours; i >= 1; i--) {
      const from = new Date(Date.now() - i * 60 * 60 * 1000);
      const to = new Date(Date.now() - (i - 1) * 60 * 60 * 1000);

      const results = await DataLog.aggregate([
        { $match: { receivedTimestamp: { $gte: from, $lte: to } } },
        {
          $group: {
            _id: "$deviceId",
            dataCount: { $sum: 1 },
          },
        },
        { $sort: { dataCount: -1 } },
      ]);

      dataVolume[`-${i}h`] = results;
    }
    res.json(dataVolume);
  } catch (err) {
    res.status(500).json({ message: "Aggregation failed", error: err.message });
  }
});

router.get("/data-volume/KB", async (req, res) => {
  try {
    const periodInHours = parseInt(req.query.periodInHours) || 1;

    if (isNaN(periodInHours) || periodInHours <= 0) {
      return res
        .status(400)
        .json({ message: "periodInHours must be a positive number" });
    }

    const dataVolume = {};
    const now = Date.now();

    for (let i = periodInHours; i >= 1; i--) {
      const from = new Date(now - i * 60 * 60 * 1000);
      const to = new Date(now - (i - 1) * 60 * 60 * 1000);

      const results = await DataLog.aggregate([
        {
          $match: {
            receivedTimestamp: { $gte: from, $lte: to },
          },
        },
        {
          $group: {
            _id: "$deviceId",
            dataCount: { $sum: 1 },
            totalSizeKB: { $sum: { $divide: ["$dataSize", 1024] } },
          },
        },
        { $sort: { dataCount: -1 } },
      ]);

      dataVolume[`-${i}h`] = results;
    }

    res.json({
      period: `${periodInHours} hour${periodInHours > 1 ? "s" : ""}`,
      dataVolume,
    });
  } catch (err) {
    console.error("Error aggregating data volume:", err);
    res.status(500).json({ message: "Aggregation failed", error: err.message });
  }
});

module.exports = router;
