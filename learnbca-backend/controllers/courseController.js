const Course = require("../models/Course");

// Add a new course
exports.addCourse = async (req, res) => {
  try {
    const { title, description, teacher, duration } = req.body;
    const course = new Course({ title, description, teacher, duration });
    await course.save();
    res.json({ message: "Course added successfully", course });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all courses
exports.getCourses = async (req, res) => {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get single course by ID
exports.getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: "Course not found" });
    res.json(course);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update a course
exports.updateCourse = async (req, res) => {
  try {
    const { title, description, teacher, duration } = req.body;
    const updatedCourse = await Course.findByIdAndUpdate(
      req.params.id,
      { title, description, teacher, duration },
      { new: true }
    );
    if (!updatedCourse) return res.status(404).json({ message: "Course not found" });
    res.json({ message: "Course updated successfully", updatedCourse });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete a course
exports.deleteCourse = async (req, res) => {
  try {
    const deletedCourse = await Course.findByIdAndDelete(req.params.id);
    if (!deletedCourse) return res.status(404).json({ message: "Course not found" });
    res.json({ message: "Course deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
