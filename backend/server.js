const express = require("express");
const http = require("http");
const mongoose = require("mongoose");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { Server } = require("socket.io");
require("dotenv").config();

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: "*" }
});

app.use(express.json());
app.use(cors());

// 🔗 MongoDB
mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

// 📦 Models
const User = mongoose.model("User", {
  id: Number,
  name: String
});

const Admin = mongoose.model("Admin", {
  username: String,
  password: String
});

const Attendance = mongoose.model("Attendance", {
  id: Number,
  name: String,
  time: String
});

// 🔐 Auth Middleware
function auth(req, res, next) {
  const token = req.headers.authorization;
  if (!token) return res.status(401).json({ msg: "No token" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ msg: "Invalid token" });
  }
}

// =========================
// 🔐 AUTH ROUTES
// =========================

// Register admin (run once)
app.post("/register", async (req, res) => {
  const hash = await bcrypt.hash(req.body.password, 10);
  await Admin.create({
    username: req.body.username,
    password: hash
  });
  res.json({ msg: "Admin created" });
});

// Login
app.post("/login", async (req, res) => {
  const admin = await Admin.findOne({ username: req.body.username });
  if (!admin) return res.status(400).json({ msg: "User not found" });

  const valid = await bcrypt.compare(req.body.password, admin.password);
  if (!valid) return res.status(400).json({ msg: "Wrong password" });

  const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET);
  res.json({ token });
});

// =========================
// 👤 USER MANAGEMENT
// =========================

app.post("/users", auth, async (req, res) => {
  await User.create(req.body);
  res.json({ msg: "User added" });
});

// =========================
// 📊 ATTENDANCE (ESP32)
// =========================

app.post("/attendance", async (req, res) => {
  const { id } = req.body;

  const user = await User.findOne({ id });
  const name = user ? user.name : "Unknown";

  const record = await Attendance.create({
    id,
    name,
    time: new Date().toLocaleString()
  });

  // 🔴 Send live update
  io.emit("attendance", record);

  res.json({ msg: "Saved" });
});

// Get attendance
app.get("/attendance", auth, async (req, res) => {
  const data = await Attendance.find().sort({ _id: -1 });
  res.json(data);
});

// =========================
// 📡 ESP32 + SOCKET SYSTEM
// =========================

let esp32Online = false;
let command = null;

// WebSocket
io.on("connection", (socket) => {
  console.log("Client connected");

  socket.emit("status", { esp32: esp32Online });
});

// ESP32 heartbeat
app.post("/device/ping", (req, res) => {
  esp32Online = true;
  io.emit("status", { esp32: true });
  res.json({ ok: true });
});

// ESP32 live messages
app.post("/device/event", (req, res) => {
  io.emit("device-event", req.body.message);
  res.json({ ok: true });
});

// Trigger enroll
app.post("/enroll", auth, (req, res) => {
  command = { type: "enroll", id: req.body.id };
  res.json({ msg: "Command sent" });
});

// ESP32 pulls command
app.get("/device/command", (req, res) => {
  if (command) {
    const cmd = command;
    command = null;
    return res.json(cmd);
  }
  res.json({ type: "none" });
});

// =========================
// 🚀 START SERVER
// =========================

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log("Server running"));