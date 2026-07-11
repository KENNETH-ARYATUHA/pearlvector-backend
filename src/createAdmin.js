// createAdmin.js
// --------------
// Run this ONCE to create your admin login. Not used by the live server --
// just a one-off setup script.
// Usage:  node src/createAdmin.js youremail@example.com yourpassword
const bcrypt = require("bcryptjs");
const pool = require("./db/pool");
require("dotenv").config();

async function createAdmin() {
  const [, , email, password] = process.argv;
  console.log("Email received:", email);
  console.log("Password received:", password);

  if (!email || !password) {
    console.log("Usage: node src/createAdmin.js <email> <password>");
    process.exit(1);
  }

  const passwordHash = await bcrypt.hash(password, 10);

  await pool.query(
    "INSERT INTO admin_users (email, password_hash) VALUES ($1, $2)",
    [email, passwordHash]
  );

  console.log(`Admin created: ${email}`);
  process.exit(0);
}

createAdmin().catch((err) => {
  console.error("Error creating admin:", err);
  process.exit(1);
});