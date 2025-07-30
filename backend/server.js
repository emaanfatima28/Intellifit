const mongoose = require("mongoose");
const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config();
const PORT = process.env.PORT || 3000;

const userRoutes = require("./routes/userRoutes");
const profileRoutes = require("./routes/profileRoutes");
const mealRoutes = require("./routes/mealRoutes");
const workoutRoutes = require("./routes/workoutRoutes");
const feedbackRoutes = require("./routes/feedbackRoutes");
const progressRoutes = require("./routes/progressRoutes");
const chatbotRoutes = require("./routes/chatbotRoutes");

app.use(express.json());

app.use('/users',userRoutes);
app.use('/profile',profileRoutes);
app.use('/meal',mealRoutes);
app.use('/workout',workoutRoutes)
app.use('/feedback', feedbackRoutes);
app.use('/progress', progressRoutes);
app.use('/chatbot', chatbotRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}.`);
})

mongoose.connect(process.env.MONGO_URI).then(() => {
    console.log(`Database Connected.`);
}
)