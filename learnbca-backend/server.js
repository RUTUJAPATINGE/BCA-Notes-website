// ================================
// LearnBCA Backend - Single File
// ================================

const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// ================================
// MongoDB Connection
// ================================
mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/learnbca", {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("✅ MongoDB Connected"))
.catch(err => console.error("❌ MongoDB Error:", err));

// ================================
// Models
// ================================
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String
});
const User = mongoose.model("User", userSchema);

const courseSchema = new mongoose.Schema({
  title: String,
  description: String,
  teacher: String,
  duration: String,
  createdAt: { type: Date, default: Date.now }
});
const Course = mongoose.model("Course", courseSchema);

const contactSchema = new mongoose.Schema({
  name: String,
  email: String,
  subject: String,
  message: String,
  createdAt: { type: Date, default: Date.now }
});
const Contact = mongoose.model("Contact", contactSchema);

// ================================
// Middleware - Auth
// ================================
const authMiddleware = (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) return res.status(401).json({ message: "No token, authorization denied" });

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET || "secretkey");
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).json({ message: "Invalid token" });
  }
};

// ================================
// Routes - Auth
// ================================
app.post("/api/auth/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword });
    await user.save();

    res.json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid email or password" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid email or password" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || "secretkey", { expiresIn: "1h" });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ================================
// Routes - Courses
// ================================

// Add new course (Protected)
app.post("/api/courses", authMiddleware, async (req, res) => {
  try {
    const { title, description, teacher, duration } = req.body;
    const course = new Course({ title, description, teacher, duration });
    await course.save();
    res.json({ message: "Course added successfully", course });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all courses (Public)
app.get("/api/courses", async (req, res) => {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get single course (Public)
app.get("/api/courses/:id", async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: "Course not found" });
    res.json(course);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update course (Protected)
app.put("/api/courses/:id", authMiddleware, async (req, res) => {
  try {
    const { title, description, teacher, duration } = req.body;
    const updated = await Course.findByIdAndUpdate(
      req.params.id,
      { title, description, teacher, duration },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: "Course not found" });
    res.json({ message: "Course updated successfully", updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete course (Protected)
app.delete("/api/courses/:id", authMiddleware, async (req, res) => {
  try {
    const deleted = await Course.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Course not found" });
    res.json({ message: "Course deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ================================
// Routes - Contact
// ================================

// Public - send message
app.post("/api/contact", async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    const contact = new Contact({ name, email, subject, message });
    await contact.save();
    res.json({ message: "Message sent successfully!", contact });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Protected - view all messages
app.get("/api/contact", authMiddleware, async (req, res) => {
  try {
    const messages = await Contact.find();
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ================================
// Start Server
// ================================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
