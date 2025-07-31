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
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
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

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}.`);
});
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));
