// contact.js
// ----------
// Receives submissions from the public contact form (replaces the fake
// "Message ready to send" demo from the frontend) and lets the admin
// view/delete them later.
const express = require("express");
const pool = require("../db/pool");
const requireAuth = require("../middleware/auth");

const router = express.Router();

// PUBLIC: anyone can submit the contact form.
router.post("/", async (req, res) => {
  const { name, email, message } = req.body;
  const result = await pool.query(
    `INSERT INTO contact_submissions (name, email, message) VALUES ($1, $2, $3) RETURNING *`,
    [name, email, message]
  );
  res.status(201).json(result.rows[0]);
});

// ADMIN: view all submissions, newest first.
router.get("/", requireAuth, async (req, res) => {
  const result = await pool.query(
    "SELECT * FROM contact_submissions ORDER BY created_at DESC"
  );
  res.json(result.rows);
});

// ADMIN: delete a submission once handled.
router.delete("/:id", requireAuth, async (req, res) => {
  await pool.query("DELETE FROM contact_submissions WHERE id=$1", [req.params.id]);
  res.json({ success: true });
});

module.exports = router;