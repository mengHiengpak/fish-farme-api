const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: [3, "Username must be at least 3 characters"],
    maxlength: [30, "Username must be at most 30 characters"],
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["admin", "viewer"],
    default: "viewer",
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  resetPasswordToken: {
    type: String,
    default: null,
  },
  resetPasswordExpires: {
    type: Date,
    default: null,
  },
}, { versionKey: false });

module.exports = mongoose.model("User", userSchema);
