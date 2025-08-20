const express = require("express");
const { sendMessage, getMessages } = require("../controllers/contactController");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();

// Public - anyone can send message
router.post("/", sendMessage);

// Protected - only logged-in user (you as admin) can view messages
router.get("/", authMiddleware, getMessages);

module.exports = router;
