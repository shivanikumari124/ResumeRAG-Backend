const express = require("express")
const cors = require("cors")
const dotenv = require("dotenv")
const path = require("path")
dotenv.config({ path: path.join(__dirname, ".env") })

const connectDB = require("./config/db")
const resumeRoutes = require("./routes/resumeRoutes")
const jobRoutes = require("./routes/jobRoutes")
const authRoutes = require("./routes/authRoutes")

const app = express()

app.use(
  cors({
    origin: process.env.CORS_ORIGIN?.split(",") || ["http://localhost:5173", "http://127.0.0.1:5173"],
    credentials: true,
  }),
)
app.use(express.json({ limit: "10mb" }))
app.use(express.urlencoded({ extended: true }))

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, service: "ResumeRAG Backend", time: new Date().toISOString() })
})

app.use("/api/resumes", resumeRoutes)
app.use("/api/auth", authRoutes)
app.use("/api/jobs", jobRoutes)

const PORT = process.env.PORT || 4000

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`[ResumeRAG] Backend listening on http://localhost:${PORT}`)
    })
  })
  .catch((err) => {
    console.error("[ResumeRAG] DB connection failed:", err)
    process.exit(1)
  })
