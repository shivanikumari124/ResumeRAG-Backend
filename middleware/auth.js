const jwt = require("jsonwebtoken")
const User = require("../models/User")

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret"

module.exports = async function auth(req, res, next) {
  try {
    const authHeader = req.headers.authorization || ""
    const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null
    if (!token) return res.status(401).json({ error: "Unauthorized" })
    const payload = jwt.verify(token, JWT_SECRET)
    const user = await User.findById(payload.sub)
    if (!user) return res.status(401).json({ error: "Unauthorized" })
    req.user = user
    next()
  } catch (err) {
    return res.status(401).json({ error: "Unauthorized" })
  }
}
