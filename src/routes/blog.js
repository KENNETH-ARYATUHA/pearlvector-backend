// blog.js
// -------
// Full blog CRUD, plus a public route for only published posts (drafts
// stay hidden from the live website until you publish them).
const express = require("express");
const pool = require("../db/pool");
const requireAuth = require("../middleware/auth");

const router = express.Router();

// PUBLIC: only published posts, newest first.
router.get("/", async (req, res) => {
  const result = await pool.query(
    "SELECT * FROM blog_posts WHERE published = true ORDER BY created_at DESC"
  );
  res.json(result.rows);
});

// PUBLIC: get a single post by its slug (for the post detail page).
router.get("/:slug", async (req, res) => {
  const result = await pool.query(
    "SELECT * FROM blog_posts WHERE slug = $1 AND published = true",
    [req.params.slug]
  );
  if (result.rows.length === 0) {
    return res.status(404).json({ error: "Post not found" });
  }
  res.json(result.rows[0]);
});

// ADMIN: list ALL posts, including unpublished drafts.
router.get("/admin/all", requireAuth, async (req, res) => {
  const result = await pool.query(
    "SELECT * FROM blog_posts ORDER BY created_at DESC"
  );
  res.json(result.rows);
});

// ADMIN: create a new post.
router.post("/", requireAuth, async (req, res) => {
  const { title, slug, cover_image_url, cover_image_public_id, content, published } = req.body;
  const result = await pool.query(
    `INSERT INTO blog_posts (title, slug, cover_image_url, cover_image_public_id, content, published)
     VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
    [title, slug, cover_image_url, cover_image_public_id, content, published || false]
  );
  res.status(201).json(result.rows[0]);
});

// ADMIN: edit a post.
router.put("/:id", requireAuth, async (req, res) => {
  const { title, slug, cover_image_url, cover_image_public_id, content, published } = req.body;
  const result = await pool.query(
    `UPDATE blog_posts
     SET title=$1, slug=$2, cover_image_url=$3, cover_image_public_id=$4, content=$5, published=$6
     WHERE id=$7 RETURNING *`,
    [title, slug, cover_image_url, cover_image_public_id, content, published, req.params.id]
  );
  res.json(result.rows[0]);
});

// ADMIN: delete a post.
router.delete("/:id", requireAuth, async (req, res) => {
  await pool.query("DELETE FROM blog_posts WHERE id=$1", [req.params.id]);
  res.json({ success: true });
});

module.exports = router;