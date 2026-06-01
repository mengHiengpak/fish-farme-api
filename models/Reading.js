const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Reading = sequelize.define("Reading", {
  device_id: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  ph: DataTypes.FLOAT,
  tds: DataTypes.FLOAT,
  temperature: DataTypes.FLOAT,
  turbidity: DataTypes.FLOAT,
  dissolved_oxygen: DataTypes.FLOAT,
  aerator: DataTypes.BOOLEAN,
  pump_main: DataTypes.BOOLEAN,
  pump_drain: DataTypes.BOOLEAN,
  pump_dosing: DataTypes.BOOLEAN,
  pump_fresh: DataTypes.BOOLEAN,
  feed_count_today: DataTypes.INTEGER,
  feeding_active: DataTypes.BOOLEAN,
  water_level: DataTypes.FLOAT,
  pump_level: DataTypes.BOOLEAN,
  status: DataTypes.STRING,
  issues: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: [],
  },
  timestamp: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  timestamps: false,
  tableName: "Readings",
  indexes: [
    { fields: ["device_id"] },
    { fields: ["device_id", "timestamp"] },
  ],
});

module.exports = Reading;
