const commands = require("../utils/commandStore");

const validActions = [
  "PUMP_MAIN_ON",   "PUMP_MAIN_OFF",
  "PUMP_DRAIN_ON",  "PUMP_DRAIN_OFF",
  "PUMP_DOSING_ON", "PUMP_DOSING_OFF",
  "PUMP_FRESH_ON",  "PUMP_FRESH_OFF",
  "AERATOR_ON",     "AERATOR_OFF",
  "FEED_NOW",       "FEED_FORCE",
  "LEVEL_PUMP_ON",  "LEVEL_PUMP_OFF",
  "LEVEL_AUTO",
  "ALL_OFF",
];

function sendCommand(req, res) {
  const { device_id } = req.params;
  const { action }    = req.body;

  if (!validActions.includes(action)) {
    return res.status(400).json({ error: "Invalid command", valid: validActions });
  }

  commands[device_id] = action;
  console.log(`[CMD] ${device_id} ← ${action}  (by ${req.user.username})`);

  res.json({ success: true, device_id, action });
}

function pollCommand(req, res) {
  const { device_id } = req.params;
  const action = commands[device_id] || null;
  if (action) delete commands[device_id];
  res.json({ action });
}

module.exports = { sendCommand, pollCommand };
