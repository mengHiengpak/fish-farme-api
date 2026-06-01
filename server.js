require("dotenv").config();
const sequelize = require("./config/db");

const express   = require("express");
const cors      = require("cors");
const helmet    = require("helmet");
const morgan    = require("morgan");

const authRoutes     = require("./routes/authRoutes");
const waterDataRoutes = require("./routes/waterDataRoutes");
const historyRoutes  = require("./routes/historyRoutes");
const commandRoutes  = require("./routes/commandRoutes");
const alertRoutes    = require("./routes/alertRoutes");
const statsRoutes    = require("./routes/statsRoutes");
const statusRoutes   = require("./routes/statusRoutes");

const app  = express();
const PORT = process.env.PORT || 3322;

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: "100kb" }));
app.use(morgan("dev"));

app.use("/api/auth",   authRoutes);
app.use("/api/water-data", waterDataRoutes);
app.use("/api/history",    historyRoutes);
app.use("/api/command",    commandRoutes);
app.use("/api/alerts",     alertRoutes);
app.use("/api/stats",      statsRoutes);
app.use("/api/status",     statusRoutes);

app.use((req, res) => {
  res.status(404).json({ error: `Route ${req.method} ${req.originalUrl} not found` });
});

app.use((err, req, res, next) => {
  if (err.name === "SequelizeUniqueConstraintError" || err.parent?.code === "23505") {
    return res.status(409).json({ error: "Duplicate key error" });
  }
  if (err.name === "SequelizeValidationError" || err.name === "SequelizeDatabaseError") {
    return res.status(400).json({ error: err.message });
  }

  const status = err.status || 500;
  const message =
    status === 500 && process.env.NODE_ENV === "production"
      ? "Internal server error"
      : err.message;

  if (status === 500) console.error("[ERROR]", err);

  res.status(status).json({ error: message });
});

async function init() {
  await sequelize.sync();
  const server = app.listen(PORT, () => {
    console.log(`
╔══════════════════════════════════════════════╗
║   Smart Fish Farm — Server (PostgreSQL)      ║
║   http://localhost:${PORT}                      ║
╚══════════════════════════════════════════════╝

  Run seed.js to create admin user.
    `);
  });

  async function shutdown() {
    console.log("\n[Server] Shutting down...");
    server.close();
    await sequelize.close();
    console.log("[Server] Exiting");
    process.exit(0);
  }
  process.on("SIGTERM", shutdown);
  process.on("SIGINT", shutdown);
}

init();
