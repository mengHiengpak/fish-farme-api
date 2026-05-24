const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "change-this-secret";
const API_KEY    = process.env.API_KEY    || "your-secret-api-key-here";

function requireJWT(req, res, next) {
  const auth = req.headers["authorization"];
  if (!auth || !auth.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  try {
    req.user = jwt.verify(auth.slice(7), JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ error: "Token invalid or expired" });
  }
}

function requireAdmin(req, res, next) {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ error: "Admin only" });
  }
  next();
}

function requireApiKey(req, res, next) {
  const auth = req.headers["authorization"];
  if (!auth || auth !== `Bearer ${API_KEY}`) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
}

module.exports = { requireJWT, requireAdmin, requireApiKey };
