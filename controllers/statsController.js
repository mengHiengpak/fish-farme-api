const Reading = require("../models/Reading");

async function getStats(req, res) {
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000);

  const data = await Reading.find({
    device_id: req.params.device_id,
    timestamp: { $gte: since },
  }).select("ph tds temperature turbidity dissolved_oxygen timestamp");

  if (!data.length) return res.json({ message: "No data in 24h" });

  const avg = (arr, key) => {
    const vals = arr.map(d => d[key]).filter(v => v != null);
    return vals.length ? +(vals.reduce((s, v) => s + v, 0) / vals.length).toFixed(2) : null;
  };
  const minOf = (arr, key) => {
    const vals = arr.map(d => d[key]).filter(v => v != null);
    return vals.length ? +Math.min(...vals).toFixed(2) : null;
  };
  const maxOf = (arr, key) => {
    const vals = arr.map(d => d[key]).filter(v => v != null);
    return vals.length ? +Math.max(...vals).toFixed(2) : null;
  };

  res.json({
    device_id: req.params.device_id,
    period:    "last_24h",
    count:     data.length,
    pH:             { avg: avg(data, "ph"),             min: minOf(data, "ph"),             max: maxOf(data, "ph") },
    tds:            { avg: avg(data, "tds"),            min: minOf(data, "tds"),            max: maxOf(data, "tds") },
    temperature:    { avg: avg(data, "temperature"),    min: minOf(data, "temperature"),    max: maxOf(data, "temperature") },
    turbidity:      { avg: avg(data, "turbidity"),      min: minOf(data, "turbidity"),      max: maxOf(data, "turbidity") },
    dissolved_oxygen:{ avg: avg(data, "dissolved_oxygen"), min: minOf(data, "dissolved_oxygen"), max: maxOf(data, "dissolved_oxygen") },
  });
}

module.exports = { getStats };
