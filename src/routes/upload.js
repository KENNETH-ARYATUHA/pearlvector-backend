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

// Delete an image by its Cloudinary public_id.
router.delete("/:public_id", requireAuth, async (req, res) => {
  try {
    await cloudinary.uploader.destroy(`pearlvector/${req.params.public_id}`);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete image" });
  }
});

module.exports = router;