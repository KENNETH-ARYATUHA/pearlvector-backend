// services.js
// -----------
// Same CRUD pattern as team.js, applied to the "What We Do" service cards.
const express = require("express");
const pool = require("../db/pool");
const requireAuth = require("../middleware/auth");

const router = express.Router();

router.get("/", async (req, res) => {
  const result = await pool.query(
    "SELECT * FROM services ORDER BY sort_order ASC, id ASC"
  );
  res.json(result.rows);
});

router.post("/", requireAuth, async (req, res) => {
  const { title, description, icon_name, sort_order } = req.body;
  const result = await pool.query(
    `INSERT INTO services (title, description, icon_name, sort_order)
     VALUES ($1, $2, $3, $4) RETURNING *`,
    [title, description, icon_name, sort_order || 0]
  );
  res.status(201).json(result.rows[0]);
});

router.put("/:id", requireAuth, async (req, res) => {
  const { title, description, icon_name, sort_order } = req.body;
  const result = await pool.query(
    `UPDATE services SET title=$1, description=$2, icon_name=$3, sort_order=$4
     WHERE id=$5 RETURNING *`,
    [title, description, icon_name, sort_order, req.params.id]
  );
  res.json(result.rows[0]);
});

router.delete("/:id", requireAuth, async (req, res) => {
  await pool.query("DELETE FROM services WHERE id=$1", [req.params.id]);
  res.json({ success: true });
});

module.exports = router;