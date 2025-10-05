const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.join(__dirname, ".env") });

const connectDB = require("./config/db");
const resumeRoutes = require("./routes/resumeRoutes");
const jobRoutes = require("./routes/jobRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();

// --- CORS Setup ---
const allowedOrigins =
  process.env.CORS_ORIGIN?.split(",") || ["http://localhost:5173", "http://127.0.0.1:5173"];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (like Postman)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        const msg = `CORS policy does not allow access from this origin: ${origin}`;
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// Handle preflight requests
app.options("*", cors());

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// --- Health Check ---
app.get("/api/health", (_req, res) => {
  res.json({
    ok: true,
    service: "ResumeRAG Backend",
    time: new Date().toISOString(),
  });
});

// --- Routes ---
app.use("/api/resumes", resumeRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);

// --- Start Server ---
const PORT = process.env.PORT || 4000;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`[ResumeRAG] Backend listening on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("[ResumeRAG] DB connection failed:", err);
    process.exit(1);
  });
