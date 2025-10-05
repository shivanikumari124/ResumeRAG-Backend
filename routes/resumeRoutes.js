const express = require("express");
const {
  uploadMiddleware,
  createResume,
  listResumes,
  searchResumes
} = require("../controllers/resumeController");
const auth = require("../middleware/auth"); // JWT middleware

const router = express.Router();

// Public routes
router.get("/", listResumes);
router.post("/search", searchResumes);

// Protected routes
router.post("/", auth, uploadMiddleware, createResume);

module.exports = router;
