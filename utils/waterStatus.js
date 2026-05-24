function getWaterStatus(data) {
  const issues = [];

  if (data.pH          != null && data.pH          < 6.0)  issues.push(`pH too low (${data.pH})`);
  if (data.pH          != null && data.pH          > 7.5)  issues.push(`pH too high (${data.pH})`);
  if (data.tds         != null && data.tds         > 1200) issues.push(`TDS high (${data.tds} ppm)`);
  if (data.turbidity   != null && data.turbidity   > 30)   issues.push(`Water turbid (${data.turbidity} NTU)`);
  if (data.temperature != null && data.temperature > 35)   issues.push(`Water too hot (${data.temperature}°C)`);
  if (data.dissolved_oxygen != null && data.dissolved_oxygen < 4.0) {
    issues.push(`DO too low (${data.dissolved_oxygen} mg/L)`);
  }
  if (data.water_level != null && data.water_level >= 85) {
    issues.push(`Water level high (${data.water_level.toFixed(1)}%)`);
  }
  if (data.water_level != null && data.water_level >= 95) {
    issues.push(`Water FOAM CRITICAL (${data.water_level.toFixed(1)}%)`);
  }

  return {
    ok:     issues.length === 0,
    status: issues.length === 0 ? "OK" : "WARNING",
    issues,
  };
}

module.exports = getWaterStatus;
