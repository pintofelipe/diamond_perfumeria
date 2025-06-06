const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "127.0.0.1",
  database: "diamond_db",
  password: "meza21",
  port: 5433,
  schema: "diamond", 
});

pool
  .query("SELECT NOW()")
  .then(() => console.log("✔ PostgreSQL conectado"))
  .catch((err) => console.error("✖ Error de PostgreSQL:", err));

module.exports = pool;