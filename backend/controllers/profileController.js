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

    let profile = await Profile.findOne({ user: userId });

    if (profile) {
      profile.age = age;
      profile.gender = gender;
      profile.height = height;
      profile.weight = weight;
      profile.goal = goal;
      profile.activityLevel = activityLevel;
      await profile.save();
    } else {
      profile = await Profile.create({
        user: userId,
        age,
        gender,
        height,
        weight,
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
  const profile = await Profile.findOne({ user: req.user.id });
  if (!profile) {
    res.status(404);
    throw new Error("Profile not found");
  }
  res.json(profile);
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
