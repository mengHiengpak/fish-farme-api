const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const User = sequelize.define("User", {
  username: {
    type: DataTypes.STRING(30),
    allowNull: false,
    unique: true,
    validate: {
      len: [3, 30],
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM("admin", "viewer"),
    defaultValue: "viewer",
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  resetPasswordToken: {
    type: DataTypes.STRING,
    defaultValue: null,
  },
  resetPasswordExpires: {
    type: DataTypes.DATE,
    defaultValue: null,
  },
}, {
  timestamps: false,
  tableName: "Users",
});

module.exports = User;
