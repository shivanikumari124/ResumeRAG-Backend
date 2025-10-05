import express from "express"
import { createJob, listJobs, matchJob } from "../controllers/jobController.js"

const router = express.Router()

router.get("/", listJobs)
router.post("/", createJob)
router.get("/:id/match", matchJob)

export default router
