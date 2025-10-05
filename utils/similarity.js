function dot(a, b) {
  let s = 0
  for (let i = 0; i < a.length; i++) s += a[i] * b[i]
  return s
}

function norm(a) {
  return Math.sqrt(dot(a, a))
}

function cosineSimilarity(a, b) {
  if (a.length !== b.length) throw new Error("Vector dimensions mismatch")
  const n = norm(a) * norm(b)
  if (n === 0) return 0
  return dot(a, b) / n
}

module.exports = { cosineSimilarity }
