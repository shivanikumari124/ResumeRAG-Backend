const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const User = require("../models/User")

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret"
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d"

function signToken(user) {
  return jwt.sign({ sub: user._id, email: user.email }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  })
}

exports.signup = async (req, res) => {
  try {
    const { email, password, name } = req.body
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" })
    }
    const existing = await User.findOne({ email })
    if (existing) {
      return res.status(409).json({ error: "User already exists" })
    }
    const passwordHash = await bcrypt.hash(password, 10)
    const user = await User.create({ email, passwordHash, name })
    const token = signToken(user)
    return res.status(201).json({
      token,
      user: { id: user._id, email: user.email, name: user.name || "" },
    })
  } catch (err) {
    console.error("[v0] signup error:", err)
    return res.status(500).json({ error: "Internal server error" })
  }
}

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" })
    }
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" })
    }
    const ok = await bcrypt.compare(password, user.passwordHash)
    if (!ok) {
      return res.status(401).json({ error: "Invalid credentials" })
    }
    const token = signToken(user)
    return res.json({
      token,
      user: { id: user._id, email: user.email, name: user.name || "" },
    })
  } catch (err) {
    console.error("[v0] login error:", err)
    return res.status(500).json({ error: "Internal server error" })
  }
}

exports.me = async (req, res) => {
  try {
    const user = req.user
    if (!user) return res.status(401).json({ error: "Unauthorized" })
    return res.json({ user: { id: user._id, email: user.email, name: user.name || "" } })
  } catch (err) {
    console.error("[v0] me error:", err)
    return res.status(500).json({ error: "Internal server error" })
  }
}
