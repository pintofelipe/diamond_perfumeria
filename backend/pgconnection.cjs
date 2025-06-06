const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "postgres",
  password: "0409156",
  port: 5432,
  schema: "diamond", 
});

pool
  .query("SELECT NOW()")
  .then(() => console.log("✔ PostgreSQL conectado"))
  .catch((err) => console.error("✖ Error de PostgreSQL:", err));

module.exports = pool;