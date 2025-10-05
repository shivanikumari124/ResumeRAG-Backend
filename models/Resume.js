const mongoose = require("mongoose")

const ResumeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String },
    skills: [{ type: String }],
    originalFilename: { type: String },
    text: { type: String, required: true },
    embedding: [{ type: Number, required: true }],
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  },
  { timestamps: true },
)

module.exports = mongoose.model("Resume", ResumeSchema)
