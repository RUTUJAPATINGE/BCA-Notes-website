const express = require("express");
const { addCourse, getCourses, getCourseById, updateCourse, deleteCourse } = require("../controllers/courseController");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/", authMiddleware, addCourse);  // Protected
router.put("/:id", authMiddleware, updateCourse); // Protected
router.delete("/:id", authMiddleware, deleteCourse); // Protected

router.get("/", getCourses);   // Public
router.get("/:id", getCourseById); // Public

module.exports = router;
