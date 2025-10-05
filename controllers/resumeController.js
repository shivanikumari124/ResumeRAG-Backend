const multer = require("multer")
const Resume = require("../models/Resume")
const { extractTextFromPDF } = require("../utils/pdfParser")
const { getEmbedding } = require("../utils/embedding")
const { cosineSimilarity } = require("../utils/similarity")
const Job = require("../models/Job")

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } })

async function createResume(req, res) {
  try {
    const { name, email, skills: skillsRaw } = req.body
    if (!name) return res.status(400).json({ error: "name required" })

    let text = ""
    let originalFilename = null

    if (req.file) {
      originalFilename = req.file.originalname
      const ext = (originalFilename.split(".").pop() || "").toLowerCase()
      if (ext === "pdf") {
        text = await extractTextFromPDF(req.file.buffer)
      } else if (ext === "txt") {
        text = req.file.buffer.toString("utf-8")
      } else {
        return res.status(400).json({ error: "Only PDF or TXT files are supported" })
      }
    } else if (req.body.text) {
      text = String(req.body.text)
    } else {
      return res.status(400).json({ error: "Provide file or text" })
    }

    const skills = skillsRaw
      ? String(skillsRaw)
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
      : []
    const combined = [name, email || "", skills.join(" "), text].join("\n")
    const embedding = await getEmbedding(combined)

    const resume = await Resume.create({
      name,
      email,
      skills,
      originalFilename,
      text,
      embedding,
      user: req.user._id,
    })
    res.status(201).json(resume)
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: "Failed to create resume" })
  }
}

async function listResumes(req, res) {
  const items = await Resume.find({ user: req.user._id }).sort({ createdAt: -1 }).limit(200)
  res.json(items)
}

async function searchResumes(req, res) {
  try {
    const { queryText, jobId, topK = 10 } = req.body || {}
    let queryEmbedding = null

    if (jobId) {
      const job = await Job.findOne({ _id: jobId, user: req.user._id })
      if (!job) return res.status(404).json({ error: "Job not found" })
      queryEmbedding = job.embedding
    } else if (queryText) {
      queryEmbedding = await getEmbedding(queryText)
    } else {
      return res.status(400).json({ error: "Provide queryText or jobId" })
    }

    const resumes = await Resume.find({ user: req.user._id }).limit(1000)
    const scored = resumes.map((r) => ({
      resume: r,
      score: cosineSimilarity(queryEmbedding, r.embedding),
    }))
    scored.sort((a, b) => b.score - a.score)
    res.json(scored.slice(0, Math.min(Number(topK), 50)))
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: "Failed to search resumes" })
  }
}

module.exports = {
  uploadMiddleware: upload.single("file"),
  createResume,
  listResumes,
  searchResumes,
}
