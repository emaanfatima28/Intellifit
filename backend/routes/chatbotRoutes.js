const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const { chatWithBot } = require("../controllers/chatbotController");

router.post("/chat", protect, chatWithBot);

module.exports = router;
