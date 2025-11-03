const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dataRoutes = require("./routes/dataRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");
const { setupElasticSync } = require("./services/elasticSync");
const deviceRoutes = require("./routes/deviceRoutes");
const path = require("path");

const app = express();
app.use(express.json());
app.use(cors());

const uri =
  "mongodb+srv://<username>:<password>@cluster0.mongodb.net/iot_database?retryWrites=true&w=majority";

mongoose
  .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected to MongoDB");

    app.use("/uploads", express.static(path.join(__dirname, "uploads")));
    app.use("/api/data", dataRoutes);
    app.use("/api/analytics", analyticsRoutes);
    app.use("/api/devices", deviceRoutes);

    setupElasticSync();

    const PORT = 4000;
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => console.error("MongoDB connection failed:", err.message));
