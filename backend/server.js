const mongoose = require("mongoose");
const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
const cors = require("cors");
const next = require("next");

dotenv.config();

const PORT = process.env.PORT || 5000;
const dev = process.env.NODE_ENV !== "production";
const appNext = next({ dev, dir: path.join(__dirname, "../frontend") });
const handle = appNext.getRequestHandler();

const app = express();

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: dev ? "http://localhost:3000" : "*",
    credentials: true,
  })
);

// API Routes
const userRoutes = require("./routes/userRoutes");
const profileRoutes = require("./routes/profileRoutes");
const mealRoutes = require("./routes/mealRoutes");
const workoutRoutes = require("./routes/workoutRoutes");
const feedbackRoutes = require("./routes/feedbackRoutes");
const progressRoutes = require("./routes/progressRoutes");
const chatbotRoutes = require("./routes/chatbotRoutes");
const adminRoutes = require("./routes/adminRoutes");

app.use("/users", userRoutes);
app.use("/profile", profileRoutes);
app.use("/meal", mealRoutes);
app.use("/workout", workoutRoutes);
app.use("/feedback", feedbackRoutes);
app.use("/progress", progressRoutes);
app.use("/chatbot", chatbotRoutes);
app.use("/admin", adminRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Error:", err);

  const isDevelopment = process.env.NODE_ENV === "development";

  res.status(err.status || 500).json({
    error: err.name || "Internal server error",
    message: err.message || "Something went wrong",
    ...(isDevelopment && { stack: err.stack }),
  });
});

// 404 handler for API
app.use("/api/*", (req, res) => {
  res.status(404).json({ error: "API route not found" });
});

// Prepare Next.js and start server
appNext.prepare().then(() => {
  // Handle all other routes with Next.js
  app.all("*", (req, res) => {
    return handle(req, res);
  });

  mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => {
      console.log("Connected to MongoDB");
      app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
      });
    })
    .catch((err) => {
      console.error("MongoDB connection error:", err);
    });
});
