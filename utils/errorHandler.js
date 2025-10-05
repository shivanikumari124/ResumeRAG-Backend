export function errorHandler(err, _req, res, _next) {
  console.error("[v0] Error:", err)
  res.status(err.status || 500).json({ error: err.message || "Server error" })
}
