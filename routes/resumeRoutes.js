const express = require("express")
const { uploadMiddleware, createResume, listResumes, searchResumes } = require("../controllers/resumeController")
const auth = require("../middleware/auth") // Added auth middleware

const router = express.Router()

router.use(auth) // Added JWT authentication for all routes below

router.get("/", listResumes)
router.post("/", uploadMiddleware, createResume)
router.post("/search", searchResumes)

module.exports = router
