const User = require("../models/User");
const MealPlan = require("../models/Meal");
const WorkoutPlan = require("../models/Workout");
const Profile = require("../models/Profile");

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select(
      "-password -resetPasswordToken -resetPasswordExpires"
    );
    res.json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    if (userId === req.user.id) {
      return res.status(400).json({ error: "Cannot delete your own account" });
    }
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    await Profile.findOneAndDelete({ user: userId });
    await MealPlan.deleteMany({ userId });
    await WorkoutPlan.deleteMany({ userId });

    await User.findByIdAndDelete(userId);

    res.json({
      success: true,
      message: "User and associated data deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete user" });
  }
};

const getAllMealPlans = async (req, res) => {
  try {
    const mealPlans = await MealPlan.find({})
      .populate("userId", "name email")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: mealPlans.length,
      mealPlans,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch meal plans" });
  }
};

const getAllWorkoutPlans = async (req, res) => {
  try {
    const workoutPlans = await WorkoutPlan.find({})
      .populate("userId", "name email")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: workoutPlans.length,
      workoutPlans,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch workout plans" });
  }
};

const getUserStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({});
    const totalMealPlans = await MealPlan.countDocuments({});
    const totalWorkoutPlans = await WorkoutPlan.countDocuments({});
    const totalProfiles = await Profile.countDocuments({});

    res.json({
      success: true,
      stats: {
        totalUsers,
        totalMealPlans,
        totalWorkoutPlans,
        totalProfiles,
      },
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch statistics" });
  }
};

module.exports = {
  getAllUsers,
  deleteUser,
  getAllMealPlans,
  getAllWorkoutPlans,
  getUserStats,
};
