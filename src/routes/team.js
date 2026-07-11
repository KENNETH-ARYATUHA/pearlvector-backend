// team.js
// -------
// Public GET (used by the live website) + admin-only POST/PUT/DELETE
// (used by the admin panel) for team members.
const express = require("express");
const pool = require("../db/pool");
const requireAuth = require("../middleware/auth");

const router = express.Router();

// PUBLIC: anyone can view the team list (the live website calls this).
router.get("/", async (req, res) => {
  const result = await pool.query(
    "SELECT * FROM team_members ORDER BY sort_order ASC, id ASC"
  );
  res.json(result.rows);
});

// ADMIN: add a new team member.
router.post("/", requireAuth, async (req, res) => {
  const { name, role, title, photo_url, photo_public_id, sort_order } = req.body;
  const result = await pool.query(
    `INSERT INTO team_members (name, role, title, photo_url, photo_public_id, sort_order)
     VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
    [name, role, title, photo_url, photo_public_id, sort_order || 0]
  );
  res.status(201).json(result.rows[0]);
});

// ADMIN: edit an existing team member.
router.put("/:id", requireAuth, async (req, res) => {
  const { name, role, title, photo_url, photo_public_id, sort_order } = req.body;
  const result = await pool.query(
    `UPDATE team_members
     SET name=$1, role=$2, title=$3, photo_url=$4, photo_public_id=$5, sort_order=$6
     WHERE id=$7 RETURNING *`,
    [name, role, title, photo_url, photo_public_id, sort_order, req.params.id]
  );
  res.json(result.rows[0]);
});

// ADMIN: remove a team member.
router.delete("/:id", requireAuth, async (req, res) => {
  await pool.query("DELETE FROM team_members WHERE id=$1", [req.params.id]);
  res.json({ success: true });
});

module.exports = router;