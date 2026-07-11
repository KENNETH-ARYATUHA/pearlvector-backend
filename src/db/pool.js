// pool.js
// -------
// Sets up a single shared connection pool to our Neon Postgres database.
// Every route file imports this instead of creating its own connection.
const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }, // required for Neon's hosted Postgres
});

module.exports = pool;