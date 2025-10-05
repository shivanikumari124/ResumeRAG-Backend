const express = require("express")
const { createJob, listJobs, getJobMatches } = require("../controllers/jobController")
const auth = require("../middleware/auth") // protect all job routes with auth middleware

const router = express.Router()

router.use(auth) // require JWT for all routes below

router.get("/", listJobs)
router.post("/", createJob)
router.get("/:id/matches", getJobMatches)

module.exports = router
