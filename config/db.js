const { Sequelize } = require("sequelize");

const DATABASE_URL = process.env.DATABASE_URL || "postgresql://postgres:password@localhost:5432/water_monitor";

const sequelize = new Sequelize(DATABASE_URL, {
  dialect: "postgres",
  logging: false,
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

sequelize
  .authenticate()
  .then(() => console.log("[PostgreSQL] Connected"))
  .catch((err) => {
    console.error("[PostgreSQL] Connection failed:", err.message);
    process.exit(1);
  });

module.exports = sequelize;
