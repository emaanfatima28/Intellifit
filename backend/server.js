const mongoose = require("mongoose");
const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config();
const PORT = process.env.PORT || 5000;
const userRoutes = require("./routes/userRoutes");
const profileRoutes = require("./routes/profileRoutes");
const mealRoutes = require("./routes/mealRoutes");
const workoutRoutes = require("./routes/workoutRoutes");
const feedbackRoutes = require("./routes/feedbackRoutes");
const progressRoutes = require("./routes/progressRoutes");
const chatbotRoutes = require("./routes/chatbotRoutes");
const adminRoutes = require("./routes/adminRoutes");
const cors = require("cors");
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use("/users", userRoutes);
app.use("/profile", profileRoutes);
app.use("/meal", mealRoutes);
app.use("/workout", workoutRoutes);
app.use("/feedback", feedbackRoutes);
app.use("/progress", progressRoutes);
app.use("/chatbot", chatbotRoutes);
app.use("/admin", adminRoutes);

// Test endpoint
app.get("/test", (req, res) => {
  res.json({
    message: "Server is running!",
    timestamp: new Date().toISOString(),
  });
});

// Test workout generation endpoint (for debugging)
app.get("/test-workout", async (req, res) => {
  try {
    const generateWorkoutPlan = require('./prompts/geminiWorkout');
    const testProfile = {
      age: 25,
      gender: 'male',
      height: 175,
      weight: 70,
      goal: 'muscle_gain',
      activityLevel: 'moderate'
    };

    const workoutPlan = await generateWorkoutPlan(testProfile);
    res.json({
      success: true,
      message: "Test workout plan generated successfully",
      workoutPlan
    });
  } catch (error) {
    console.error("Test workout generation failed:", error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Test meal generation endpoint (for debugging)
app.get("/test-meal", async (req, res) => {
  try {
    const axios = require('axios');
    const testPrompt = "Make it vegetarian";
    const mealType = "lunch";
    
    const singleMealPrompt = `Create a single ${mealType} meal based on this request: ${testPrompt}. 
    
User Profile:
- Age: 25
- Gender: male
- Height: 175 cm
- Weight: 70 kg
- Goal: muscle_gain
- Activity Level: moderate

Respond ONLY with this JSON format:
{
  "type": "${mealType}",
  "name": "Meal name",
  "calories": 300,
  "macros": { "protein": 20, "carbs": 30, "fat": 10 },
  "ingredients": ["ingredient1", "ingredient2", "ingredient3"]
}`;

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [{ text: singleMealPrompt }],
          },
        ],
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
        timeout: 30000,
      }
    );

    const text = response.data.candidates[0].content.parts[0].text;
    const start = text.indexOf("{");
    const end = text.lastIndexOf("}") + 1;
    
    if (start === -1 || end === 0) {
      throw new Error("No valid JSON found in response");
    }
    
    const jsonText = text.slice(start, end);
    const newMeal = JSON.parse(jsonText);
    
    res.json({
      success: true,
      message: "Test meal generation successful",
      meal: newMeal,
      rawResponse: text
    });
  } catch (error) {
    console.error("Test meal generation failed:", error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});
// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Error:", err);

  // Log additional error details
  console.error("Error details:", {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    timestamp: new Date().toISOString()
  });

  // Don't send error stack in production
  const isDevelopment = process.env.NODE_ENV === 'development';

  res.status(err.status || 500).json({
    error: err.name || "Internal server error",
    message: err.message || "Something went wrong",
    ...(isDevelopment && { stack: err.stack })
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}.`);
});
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));
