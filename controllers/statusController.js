const Reading = require("../models/Reading");
const Alert   = require("../models/Alert");

async function getStatus(req, res) {
  const [historyCount, alertCount, deviceRows] = await Promise.all([
    Reading.count(),
    Alert.count(),
    Reading.findAll({ attributes: ["device_id"], group: ["device_id"] }),
  ]);

  res.json({
    server:       "running",
    postgres:     "connected",
    devices:      deviceRows.length,
    history_size: historyCount,
    alerts:       alertCount,
    uptime:       Math.floor(process.uptime()) + "s",
  });
}

module.exports = { getStatus };
