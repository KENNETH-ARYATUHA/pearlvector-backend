const express = require("express");
const pool = require("../db/pool");
const requireAuth = require("../middleware/auth");

const router = express.Router();

router.get("/", async (req, res) => {
  const result = await pool.query("SELECT * FROM projects ORDER BY sort_order ASC, id ASC");
  res.json(result.rows);
});

router.post("/", requireAuth, async (req, res) => {
  const { title, description, image_url, image_public_id, link, sort_order } = req.body;
  const result = await pool.query(
    `INSERT INTO projects (title, description, image_url, image_public_id, link, sort_order)
     VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
    [title, description, image_url, image_public_id, link, sort_order || 0]
  );
  res.status(201).json(result.rows[0]);
});

router.put("/:id", requireAuth, async (req, res) => {
  const { title, description, image_url, image_public_id, link, sort_order } = req.body;
  const result = await pool.query(
    `UPDATE projects SET title=$1, description=$2, image_url=$3, image_public_id=$4, link=$5, sort_order=$6
     WHERE id=$7 RETURNING *`,
    [title, description, image_url, image_public_id, link, sort_order, req.params.id]
  );
  res.json(result.rows[0]);
});

router.delete("/:id", requireAuth, async (req, res) => {
  await pool.query("DELETE FROM projects WHERE id=$1", [req.params.id]);
  res.json({ success: true });
});

module.exports = router;