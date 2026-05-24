const mongoose = require("mongoose");

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/water_monitor";

const options = {
  serverSelectionTimeoutMS: 5000,
  heartbeatFrequencyMS: 10000,
};

mongoose.connect(MONGO_URI, options)
  .then(() => console.log("[MongoDB] Connected"))
  .catch(err => {
    console.error("[MongoDB] Connection failed:", err.message);
    process.exit(1);
  });

mongoose.connection.on("error", err => {
  console.error("[MongoDB] Runtime error:", err.message);
});

mongoose.connection.on("disconnected", () => {
  console.warn("[MongoDB] Disconnected");
});

module.exports = mongoose;
