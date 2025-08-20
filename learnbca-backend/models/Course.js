const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  teacher: { type: String },
  duration: { type: String }, // e.g. "3 Months"
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Course", courseSchema);
