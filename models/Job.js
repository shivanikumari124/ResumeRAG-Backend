const mongoose = require("mongoose")

const JobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    company: { type: String },
    description: { type: String, required: true },
    embedding: [{ type: Number, required: true }],
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  },
  { timestamps: true },
)

module.exports = mongoose.model("Job", JobSchema)
