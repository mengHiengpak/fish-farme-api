const { Op } = require("sequelize");
const sequelize = require("../config/db");
const Reading = require("../models/Reading");
const Alert   = require("../models/Alert");
const getWaterStatus = require("../utils/waterStatus");
const AppError = require("../utils/appError");
const commands = require("../utils/commandStore");

async function ingestData(req, res) {
  const {
    device_id, pH, tds, temperature, turbidity,
    dissolved_oxygen, aerator,
    pump_main, pump_drain, pump_dosing, pump_fresh,
    feed_count_today, feeding_active,
    water_level, pump_level,
  } = req.body;

  if (!device_id || pH == null || tds == null) {
    throw new AppError(400, "Insufficient data");
  }

  const waterStatus = getWaterStatus(req.body);

  await Reading.create({
    device_id,
    ph: pH,
    tds,
    temperature,
    turbidity,
    dissolved_oxygen,
    aerator: aerator ?? null,
    pump_main: pump_main ?? null,
    pump_drain: pump_drain ?? null,
    pump_dosing: pump_dosing ?? null,
    pump_fresh: pump_fresh ?? null,
    feed_count_today: feed_count_today ?? null,
    feeding_active: feeding_active ?? null,
    water_level: water_level ?? null,
    pump_level: pump_level ?? null,
    status: waterStatus.status,
    issues: waterStatus.issues,
  });

  if (!waterStatus.ok) {
    await Alert.create({
      device_id,
      message: waterStatus.issues.join(", "),
      severity: waterStatus.issues.length > 1 ? "DANGER" : "WARNING",
    });
  }

  console.log(`[DATA] ${device_id} → pH:${pH} TDS:${tds} DO:${dissolved_oxygen} → ${waterStatus.status}`);

  res.json({
    status:  "received",
    water:   waterStatus.status,
    command: commands[device_id] || null,
  });
}

async function getLatestAll(req, res) {
  const [devices] = await sequelize.query(`
    SELECT DISTINCT ON (device_id) *
    FROM "Readings"
    ORDER BY device_id, timestamp DESC
  `);
  res.json({ devices, count: devices.length });
}

async function getLatestByDevice(req, res) {
  const reading = await Reading.findOne({
    where: { device_id: req.params.device_id },
    order: [["timestamp", "DESC"]],
  });
  if (!reading) throw new AppError(404, "Device not found");
  res.json(reading);
}

async function getHistory(req, res) {
  const limit     = Math.min(parseInt(req.query.limit) || 100, 1000);
  const device_id = req.query.device_id;
  const from      = req.query.from;
  const to        = req.query.to;

  const safeLimit = isNaN(limit) ? 100 : limit;

  const filter = {};
  if (device_id) filter.device_id = device_id;
  if (from || to) {
    filter.timestamp = {};
    if (from) {
      const d = new Date(from);
      if (isNaN(d.getTime())) throw new AppError(400, "Invalid from date");
      filter.timestamp[Op.gte] = d;
    }
    if (to) {
      const d = new Date(to);
      if (isNaN(d.getTime())) throw new AppError(400, "Invalid to date");
      filter.timestamp[Op.lte] = d;
    }
  }

  const rows = await Reading.findAll({
    where: filter,
    attributes: ["device_id", "ph", "tds", "temperature", "turbidity", "dissolved_oxygen", "status", "timestamp"],
    order: [["timestamp", "DESC"]],
    limit: safeLimit,
  });

  res.json({ history: rows.reverse(), count: rows.length });
}

module.exports = { ingestData, getLatestAll, getLatestByDevice, getHistory };
