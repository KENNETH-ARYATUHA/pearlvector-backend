// upload.js
// ---------
// Handles photo uploads and deletions via Cloudinary. The admin panel
// sends the image file here, gets back a hosted URL + public_id, and
// saves those two values against whichever record (team member, blog
// post, etc.) the photo belongs to.
const express = require("express");
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary").v2;
const requireAuth = require("../middleware/auth");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "pearlvector",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
  },
});
const upload = multer({ storage });

const router = express.Router();

// Upload a new image. Field name must be "image" in the form data.
router.post("/", requireAuth, upload.single("image"), (req, res) => {
  res.json({
    url: req.file.path,       // hosted image URL -- save this in your DB
    public_id: req.file.filename, // needed later if you want to delete it
  });
});

// Delete an image by its Cloudinary public_id. Using a wildcard because
// Cloudinary public_ids include a folder path with a slash in it
// (e.g. "pearlvector/abc123"), which a normal :param can't capture.
router.delete("/*", requireAuth, async (req, res) => {
  const publicId = req.params[0]; // everything after /upload/
  try {
    await cloudinary.uploader.destroy(publicId);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete image" });
  }
});

module.exports = router;