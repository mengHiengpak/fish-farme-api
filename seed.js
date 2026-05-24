require("dotenv").config();
require("./config/db");

const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const User = require("./models/User");

async function seed() {
  try {
    const username = "admin";
    const password = "admin123";
    const hash     = await bcrypt.hash(password, 10);

    const existing = await User.findOne({ username });
    if (existing) {
      console.log(`[Seed] Admin user "${username}" already exists (id=${existing.id})`);
    } else {
      await User.create({ username, password: hash, role: "admin" });
      console.log(`[Seed] Admin user created — username: ${username}, password: ${password}`);
    }

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error("[Seed] Error:", err.message);
    process.exit(1);
  }
}

seed();
