const Job = require("../models/Job")
const Resume = require("../models/Resume")
const { getEmbedding } = require("../utils/embedding")
const { cosineSimilarity } = require("../utils/similarity")

async function createJob(req, res) {
  try {
    const { title, company, description } = req.body
    if (!title || !description) return res.status(400).json({ error: "title and description required" })
    const embedding = await getEmbedding([title, company || "", description].join("\n"))
    const job = await Job.create({ title, company, description, embedding, user: req.user._id }) //
    res.status(201).json(job)
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: "Failed to create job" })
  }
}

async function listJobs(req, res) {
  const items = await Job.find({ user: req.user._id }).sort({ createdAt: -1 }).limit(200)
  res.json(items)
}

async function getJobMatches(req, res) {
  try {
    const { id } = req.params
    const { topK = 10 } = req.query
    const job = await Job.findOne({ _id: id, user: req.user._id })
    if (!job) return res.status(404).json({ error: "Job not found" })
    const resumes = await Resume.find({ user: req.user._id }).limit(1000)
    const scored = resumes.map((r) => ({
      resume: r,
      score: cosineSimilarity(job.embedding, r.embedding),
    }))
    scored.sort((a, b) => b.score - a.score)
    res.json(scored.slice(0, Math.min(Number(topK), 50)))
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: "Failed to get matches" })
  }
}

module.exports = { createJob, listJobs, getJobMatches }
