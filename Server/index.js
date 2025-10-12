const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const sensorRoutes = require("./routes/sensorRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");
const { setupElasticSync } = require("./services/elasticSync");

const app = express();
app.use(express.json());
app.use(cors());

// MongoDB Connection
const uri =
  "mongodb+srv://Admin:Admin@cluster0.tiohfd7.mongodb.net/Cluster0?retryWrites=true&w=majority&appName=Cluster0";

mongoose
  .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("✅ Connected to MongoDB");

    app.use("/api/sensors", sensorRoutes);
    app.use("/api/analytics", analyticsRoutes);

    setupElasticSync();

    const PORT = 4000;
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => console.error("❌ MongoDB connection failed:", err.message));
