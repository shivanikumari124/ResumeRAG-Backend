import express from "express"
import multer from "multer"
import { uploadResume, listResumes, searchResumes } from "../controllers/resumeController.js"

const router = express.Router()
const upload = multer({ storage: multer.memoryStorage() })

router.get("/", listResumes)
router.get("/search", searchResumes)
router.post("/upload", upload.single("file"), uploadResume)

export default router
