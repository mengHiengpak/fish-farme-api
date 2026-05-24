const mongoose = require("mongoose");

const alertSchema = new mongoose.Schema({
  device_id: {
    type: String,
    required: true,
    index: true,
    trim: true,
  },
  message:   String,
  severity: {
    type: String,
    enum: ["WARNING", "DANGER"],
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
}, { versionKey: false });

alertSchema.index({ timestamp: -1 });

module.exports = mongoose.model("Alert", alertSchema);
