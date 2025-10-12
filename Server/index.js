const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const sensorRoutes = require("./routes/sensorRoutes");

const app = express();
app.use(express.json());
app.use(cors());

const uri =
  "mongodb+srv://Admin:Admin@cluster0.tiohfd7.mongodb.net/Cluster0?retryWrites=true&w=majority&appName=Cluster0";

mongoose
  .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    // API route
    app.use("/api/sensors", sensorRoutes);

    const PORT = 4000;
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB:", err);
  });
