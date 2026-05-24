const mongoose = require("mongoose");

const readingSchema = new mongoose.Schema({
  device_id: {
    type: String,
    required: true,
    index: true,
    trim: true,
  },
  ph:               Number,
  tds:              Number,
  temperature:      Number,
  turbidity:        Number,
  dissolved_oxygen: Number,
  aerator:          Boolean,
  pump_main:        Boolean,
  pump_drain:       Boolean,
  pump_dosing:      Boolean,
  pump_fresh:       Boolean,
  feed_count_today: Number,
  feeding_active:   Boolean,
  water_level:      Number,
  pump_level:       Boolean,
  status:           String,
  issues:           [String],
  timestamp: {
    type: Date,
    default: Date.now,
  },
}, { versionKey: false });

readingSchema.index({ device_id: 1, timestamp: -1 });

module.exports = mongoose.model("Reading", readingSchema);
