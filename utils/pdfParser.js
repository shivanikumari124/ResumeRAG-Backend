const pdf = require("pdf-parse")

async function extractTextFromPDF(buffer) {
  const data = await pdf(buffer)
  const text = (data.text || "").replace(/\s+/g, " ").trim()
  return text
}

module.exports = { extractTextFromPDF }
