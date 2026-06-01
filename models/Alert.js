const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Alert = sequelize.define("Alert", {
  device_id: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  message: DataTypes.STRING,
  severity: {
    type: DataTypes.ENUM("WARNING", "DANGER"),
  },
  timestamp: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  timestamps: false,
  tableName: "Alerts",
  indexes: [
    { fields: ["device_id"] },
    { fields: ["timestamp"] },
  ],
});

module.exports = Alert;
