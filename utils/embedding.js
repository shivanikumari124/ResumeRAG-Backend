const crypto = require("crypto")

let openaiClient = null
let canUseOpenAI = false
try {
  const OpenAI = require("openai")
  if (process.env.OPENAI_API_KEY) {
    openaiClient = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
    canUseOpenAI = true
  }
} catch (e) {
  // openai package might not be installed; ignore
  canUseOpenAI = false
}

const DEFAULT_DIM = Number.parseInt(process.env.EMBED_DIM || "512", 10)

// Simple tokenizer
function tokenize(text) {
  return (text || "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean)
}

// Hashing trick embedding
function hashingEmbedding(text, dim = DEFAULT_DIM) {
  const vec = new Array(dim).fill(0)
  const tokens = tokenize(text)
  for (const t of tokens) {
    const h = crypto.createHash("md5").update(t).digest()
    // use first 4 bytes for an integer
    const idx = h.readUInt32BE(0) % dim
    vec[idx] += 1
  }
  // L2 normalize
  const n = Math.sqrt(vec.reduce((s, v) => s + v * v, 0)) || 1
  return vec.map((v) => v / n)
}

async function openAIEmbedding(text) {
  const content = (text || "").slice(0, 8000) // keep within token limits
  const res = await openaiClient.embeddings.create({
    model: "text-embedding-3-small",
    input: content,
  })
  return res.data[0].embedding
}

async function getEmbedding(text) {
  if (canUseOpenAI) {
    try {
      return await openAIEmbedding(text)
    } catch (e) {
      console.warn("[ResumeRAG] OpenAI embedding failed, falling back to hashing:", e.message)
      return hashingEmbedding(text)
    }
  }
  return hashingEmbedding(text)
}

module.exports = { getEmbedding, hashingEmbedding }
