const express = require("express");
const { createJob, listJobs, getJobMatches } = require("../controllers/jobController");
const auth = require("../middleware/auth"); // JWT middleware

const router = express.Router();

// Public route: anyone can see job listings
router.get("/", listJobs);

// Protected routes: only logged-in users
router.post("/", auth, createJob);
router.get("/:id/matches", auth, getJobMatches);

module.exports = router;
