// industries.js
// -------------
// Same CRUD pattern, applied to the "Industries We Serve" strip.
const express = require("express");
const pool = require("../db/pool");
const requireAuth = require("../middleware/auth");

const router = express.Router();

router.get("/", async (req, res) => {
  const result = await pool.query(
    "SELECT * FROM industries ORDER BY sort_order ASC, id ASC"
  );
  res.json(result.rows);
});

router.post("/", requireAuth, async (req, res) => {
  const { label, icon_name, sort_order } = req.body;
  const result = await pool.query(
    `INSERT INTO industries (label, icon_name, sort_order)
     VALUES ($1, $2, $3) RETURNING *`,
    [label, icon_name, sort_order || 0]
  );
  res.status(201).json(result.rows[0]);
});

router.put("/:id", requireAuth, async (req, res) => {
  const { label, icon_name, sort_order } = req.body;
  const result = await pool.query(
    `UPDATE industries SET label=$1, icon_name=$2, sort_order=$3 WHERE id=$4 RETURNING *`,
    [label, icon_name, sort_order, req.params.id]
  );
  res.json(result.rows[0]);
});

router.delete("/:id", requireAuth, async (req, res) => {
  await pool.query("DELETE FROM industries WHERE id=$1", [req.params.id]);
  res.json({ success: true });
});

module.exports = router;