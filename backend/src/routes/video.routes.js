const express = require("express");

const router = express.Router();

const authMiddleware = require("../middlewares/auth.middleware");

const authorizeRoles = require("../middlewares/role.middleware");

const upload = require("../middlewares/upload.middleware");

const {
  uploadVideo,
  getVideos,
  streamVideo,
  deleteVideo,
  getSingleVideo,
} = require("../controllers/video.controller");


// ==========================
// Upload Video
// ==========================
router.post(
  "/upload",
  authMiddleware,
  authorizeRoles("editor", "admin"),
  upload.single("video"),
  uploadVideo
);


// ==========================
// Get All Videos
// ==========================
router.get(
  "/",
  authMiddleware,
  getVideos
);


// ==========================
// Get Single Video
// ==========================
router.get(
  "/:id",
  authMiddleware,
  getSingleVideo
);


// ==========================
// Stream Video
// ==========================



// ==========================
// Delete Video
// ==========================
router.delete(
  "/:id",
  authMiddleware,
  authorizeRoles("editor", "admin"),
  deleteVideo
);

module.exports = router;