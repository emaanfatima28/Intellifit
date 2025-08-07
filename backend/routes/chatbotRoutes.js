const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const { chatWithBot } = require("../controllers/chatbotController");

router.post("/chat", protect, chatWithBot, {
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`, // token must be valid
  },
});
module.exports = router;
