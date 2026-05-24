const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const jwt    = require("jsonwebtoken");
const User   = require("../models/User");
const AppError = require("../utils/appError");

const JWT_SECRET = process.env.JWT_SECRET || "change-this-secret";

async function register(req, res) {
  const { username, password, role } = req.body;
  if (!username || !password) {
    throw new AppError(400, "Username and password required");
  }
  if (password.length < 6) {
    throw new AppError(400, "Password must be at least 6 characters");
  }
  if (!/^[a-zA-Z0-9_]{3,30}$/.test(username)) {
    throw new AppError(400, "Username must be 3-30 alphanumeric characters or underscores");
  }
  if (password.length > 128) {
    throw new AppError(400, "Password too long");
  }

  const existing = await User.findOne({ username }).select("_id");
  if (existing) throw new AppError(409, "Username already exists");

  const hash = await bcrypt.hash(password, 10);
  const user = await User.create({
    username,
    password: hash,
    role: role === "admin" ? "admin" : "viewer",
  });

  res.status(201).json({
    message: "Account created",
    user: { id: user.id, username, role: role === "admin" ? "admin" : "viewer" },
  });
}

async function login(req, res) {
  const { username, password } = req.body;
  if (!username || !password) {
    throw new AppError(400, "Username and password required");
  }

  const user = await User.findOne({ username });
  if (!user) throw new AppError(401, "Invalid username or password");

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) throw new AppError(401, "Invalid username or password");

  const token = jwt.sign(
    { id: user.id, username: user.username, role: user.role },
    JWT_SECRET,
    { expiresIn: "7d" },
  );

  res.json({
    message: "Login successful",
    token,
    user: { id: user.id, username: user.username, role: user.role },
  });
}

async function me(req, res) {
  const user = await User.findById(req.user.id).select("username role created_at");
  if (!user) throw new AppError(404, "User not found");
  res.json(user);
}

async function changePassword(req, res) {
  const { oldPassword, newPassword } = req.body;
  if (!oldPassword || !newPassword) {
    throw new AppError(400, "Old password and new password required");
  }
  if (newPassword.length < 6) {
    throw new AppError(400, "New password must be at least 6 characters");
  }
  if (newPassword.length > 128) {
    throw new AppError(400, "New password too long");
  }

  const user = await User.findById(req.user.id);
  if (!user) throw new AppError(404, "User not found");

  const ok = await bcrypt.compare(oldPassword, user.password);
  if (!ok) throw new AppError(401, "Old password is incorrect");

  const hash = await bcrypt.hash(newPassword, 10);
  await User.findByIdAndUpdate(req.user.id, { password: hash });

  res.json({ message: "Password changed successfully" });
}

async function listUsers(req, res) {
  const users = await User.find().select("username role created_at").sort({ created_at: -1 });
  res.json(users);
}

async function deleteUser(req, res) {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) throw new AppError(404, "User not found");
  res.json({ message: "User deleted" });
}

async function forgotPassword(req, res) {
  const { username } = req.body;
  if (!username) {
    throw new AppError(400, "Username is required");
  }

  const user = await User.findOne({ username });
  if (!user) {
    throw new AppError(404, "No account with that username");
  }

  const token = crypto.randomBytes(32).toString("hex");
  user.resetPasswordToken = token;
  user.resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000);
  await user.save();

  res.json({ message: "Reset token generated", token });
}

async function resetPassword(req, res) {
  const { token, newPassword } = req.body;
  if (!token || !newPassword) {
    throw new AppError(400, "Token and new password are required");
  }
  if (newPassword.length < 6) {
    throw new AppError(400, "Password must be at least 6 characters");
  }
  if (newPassword.length > 128) {
    throw new AppError(400, "Password too long");
  }

  const user = await User.findOne({
    resetPasswordToken: token,
    resetPasswordExpires: { $gt: Date.now() },
  });
  if (!user) {
    throw new AppError(400, "Token is invalid or has expired");
  }

  const hash = await bcrypt.hash(newPassword, 10);
  user.password = hash;
  user.resetPasswordToken = null;
  user.resetPasswordExpires = null;
  await user.save();

  res.json({ message: "Password has been reset" });
}

module.exports = { register, login, me, changePassword, listUsers, deleteUser, forgotPassword, resetPassword };
