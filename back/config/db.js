const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "padel_app",
  password: "padelappln",
  port: 5432,
});

module.exports = pool;