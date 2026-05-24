const Reading = require("../models/Reading");
const Alert   = require("../models/Alert");

async function getStatus(req, res) {
  const [historyCount, alertCount, deviceIds] = await Promise.all([
    Reading.countDocuments(),
    Alert.countDocuments(),
    Reading.distinct("device_id"),
  ]);

  res.json({
    server:       "running",
    mongo:        "connected",
    devices:      deviceIds.length,
    history_size: historyCount,
    alerts:       alertCount,
    uptime:       Math.floor(process.uptime()) + "s",
  });
}

module.exports = { getStatus };
