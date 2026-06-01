const Alert = require("../models/Alert");

async function getAlerts(req, res) {
  const limit     = Math.min(parseInt(req.query.limit) || 20, 100);
  const device_id = req.query.device_id;
  const safeLimit = isNaN(limit) ? 20 : limit;

  const filter = {};
  if (device_id) filter.device_id = device_id;

  const rows = await Alert.findAll({
    where: filter,
    order: [["timestamp", "DESC"]],
    limit: safeLimit,
  });
  res.json({ alerts: rows, count: rows.length });
}

async function deleteAlerts(req, res) {
  const device_id = req.query.device_id;
  const filter = {};
  if (device_id) filter.device_id = device_id;

  const result = await Alert.destroy({ where: filter });
  res.json({ message: "Alerts deleted", deleted: result });
}

module.exports = { getAlerts, deleteAlerts };
