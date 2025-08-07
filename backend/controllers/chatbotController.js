const axios = require("axios");
const { logger, retryWithBackoff, rateLimiter } = require("../utils/logger");

exports.chatWithBot = async (req, res) => {
  const startTime = Date.now();
  let message;
  const userId = req.user.id;

  try {
    if (!req.body) {
      return res.status(400).json({ error: "Request body is missing" });
    }

    const { message: msg } = req.body;
    message = msg;

    if (!message || typeof message !== "string" || message.trim() === "") {
      return res.status(400).json({
        error: "Message is required and must be a non-empty string",
        received: req.body,
      });
    }

    if (!rateLimiter.isAllowed(`user_${userId}`)) {
      logger.log(`Rate limit exceeded for user ${userId}`, "WARN");
      return res
        .status(429)
        .json({ error: "Too many requests. Please try again later." });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      logger.error("Gemini API key not configured");
      return res.status(500).json({ error: "Gemini API key not configured" });
    }

    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const payload = {
      contents: [
        {
          parts: [
            {
              text: `You are a helpful fitness and nutrition assistant. The user is asking: ${message}. Please provide helpful, accurate, and supportive advice related to fitness, nutrition, workouts, meal planning, or general health. Keep responses concise but informative.`,
            },
          ],
        },
      ],
    };

    const response = await retryWithBackoff(async () => {
      return await axios.post(apiUrl, payload, {
        headers: {
          "Content-Type": "application/json",
        },
        timeout: 10000,
      });
    });

    const botResponse = response.data.candidates[0].content.parts[0].text;

    const responseTime = Date.now() - startTime;
    logger.api("/chatbot/chat", "POST", 200, responseTime, userId);
    logger.aiApi("Gemini", message, botResponse);

    res.json({
      success: true,
      message: botResponse,
      userId: userId,
      timestamp: new Date(),
    });
  } catch (error) {
    const responseTime = Date.now() - startTime;

    logger.error("Chatbot API error", error);
    logger.aiApi("Gemini", message, null, error.message);

    if (error.response) {
      logger.api(
        "/chatbot/chat",
        "POST",
        error.response.status,
        responseTime,
        userId
      );
      res.status(error.response.status).json({
        error: "Gemini API error",
        details: error.response.data || error.message,
      });
    } else if (error.request) {
      logger.api("/chatbot/chat", "POST", 500, responseTime, userId);
      res.status(500).json({
        error: "No response from Gemini API",
        details: "Network error or API unavailable",
      });
    } else {
      logger.api("/chatbot/chat", "POST", 500, responseTime, userId);
      res.status(500).json({
        error: "Failed to get response from chatbot",
        details: error.message,
      });
    }
  }
};
