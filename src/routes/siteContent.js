// siteContent.js
// --------------
// Handles single "field" style content -- vision, mission, hero photo URL,
// office photo URL, contact details, etc. Stored as key/value pairs so we
// don't need a rigid table structure for loosely related fields.
const express = require("express");
const pool = require("../db/pool");
const requireAuth = require("../middleware/auth");

const router = express.Router();

// PUBLIC: get all site content as a single object, e.g.
// { vision: "...", mission: "...", hero_photo_url: "..." }
router.get("/", async (req, res) => {
  const result = await pool.query("SELECT * FROM site_content");
  const content = {};
  result.rows.forEach((row) => {
    content[row.key] = row.value;
  });
  res.json(content);
});

// ADMIN: create or update a single field.
// Body: { key: "vision", value: "New vision text..." }
router.put("/", requireAuth, async (req, res) => {
  const { key, value } = req.body;
  await pool.query(
    `INSERT INTO site_content (key, value) VALUES ($1, $2)
     ON CONFLICT (key) DO UPDATE SET value = $2`,
    [key, value]
  );
  res.json({ key, value });
});

module.exports = router;