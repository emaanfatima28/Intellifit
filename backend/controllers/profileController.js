const User = require("../models/User");
const Profile = require("../models/Profile");
const Feedback = require("../models/Feedback");
const Progress = require("../models/Progress")
const MealPlan = require("../models/Meal");
const WorkoutPlan = require("../models/Workout");

const createOrUpdateProfile = async (req, res) => {
  try {
    const { age, gender, height, weight, goal, activityLevel } = req.body;
    const userId = req.user.id;

    // Validate required fields
    if (!age || !gender || !height || !weight || !goal || !activityLevel) {
      return res.status(400).json({ 
        error: "All fields are required: age, gender, height, weight, goal, activityLevel" 
      });
    }

    // Validate data types
    if (isNaN(age) || isNaN(height) || isNaN(weight)) {
      return res.status(400).json({ 
        error: "Age, height, and weight must be valid numbers" 
      });
    }

    // Validate enum values
    const validGenders = ['male', 'female'];
    const validGoals = ['weight_loss', 'muscle_gain', 'maintenance'];
    const validActivityLevels = ['low', 'moderate', 'high'];

    if (!validGenders.includes(gender)) {
      return res.status(400).json({ error: "Gender must be 'male' or 'female'" });
    }
    if (!validGoals.includes(goal)) {
      return res.status(400).json({ error: "Goal must be 'weight_loss', 'muscle_gain', or 'maintenance'" });
    }
    if (!validActivityLevels.includes(activityLevel)) {
      return res.status(400).json({ error: "Activity level must be 'low', 'moderate', or 'high'" });
    }

    let profile = await Profile.findOne({ user: userId });

    if (profile) {
      // Update existing profile
      profile.age = parseInt(age);
      profile.gender = gender;
      profile.height = parseInt(height);
      profile.weight = parseInt(weight);
      profile.goal = goal;
      profile.activityLevel = activityLevel;
      await profile.save();
    } else {
      // Create new profile
      profile = await Profile.create({
        user: userId,
        age: parseInt(age),
        gender,
        height: parseInt(height),
        weight: parseInt(weight),
        goal,
        activityLevel,
      });
    }

    res.status(200).json(profile);
  } catch (error) {
    console.error("Profile creation error:", error);
    res.status(500).json({ error: error.message });
  }
};

const getProfile = async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });
    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }
    res.json(profile);
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({ error: error.message });
  }
};

const deleteProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    
    if (userId !== req.user.id) {
      return res.status(403).json({ error: "You can only delete your own account" });
    }
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    await Profile.findOneAndDelete({ user: userId });
    await MealPlan.deleteMany({ userId });
    await WorkoutPlan.deleteMany({ userId });
    await Feedback.deleteMany({ userId });
    await Progress.deleteMany({ userId });

    await User.findByIdAndDelete(userId);

    res.json({
      success: true,
      message: "User and associated data deleted successfully",
    });
  } catch (error) {
    console.error("Delete profile error:", error);
    res.status(500).json({ error: "Failed to delete user" });
  }
};

module.exports = { createOrUpdateProfile, getProfile,deleteProfile };
