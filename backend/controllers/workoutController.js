const WorkoutPlan = require('../models/Workout');
const Profile = require('../models/Profile');
const generateWorkoutPlan = require('../prompts/geminiWorkout');

const createWorkoutPlan = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log(`Creating workout plan for user: ${userId}`);

    // Find user profile
    const profile = await Profile.findOne({ user: userId });
    if (!profile) {
      console.log(`Profile not found for user: ${userId}`);
      return res.status(404).json({
        error: "User profile not found",
        message: "Please complete your profile first to generate a workout plan"
      });
    }

    console.log(`Profile found for user: ${userId}`, {
      age: profile.age,
      gender: profile.gender,
      goal: profile.goal,
      activityLevel: profile.activityLevel
    });

    // Validate that profile has all required fields
    const requiredFields = ['age', 'gender', 'height', 'weight', 'goal', 'activityLevel'];
    const missingFields = requiredFields.filter(field => !profile[field]);

    if (missingFields.length > 0) {
      console.log(`Incomplete profile for user: ${userId}, missing: ${missingFields.join(', ')}`);
      return res.status(400).json({
        error: "Incomplete profile",
        message: `Please complete your profile. Missing fields: ${missingFields.join(', ')}`,
        missingFields
      });
    }

    // Generate workout plan using Gemini
    console.log(`Generating workout plan for user: ${userId}`);
    let workoutDays;
    try {
      workoutDays = await generateWorkoutPlan(profile);
      console.log(`Workout plan generated successfully for user: ${userId}, days: ${workoutDays.length}`);
    } catch (genError) {
      console.error(`Workout generation error for user ${userId}:`, genError);
      return res.status(500).json({
        error: "Workout generation failed",
        message: "Failed to generate workout plan. Please try again later."
      });
    }

    // Validate workout days structure
    if (!workoutDays || !Array.isArray(workoutDays) || workoutDays.length !== 7) {
      console.error(`Invalid workout plan format for user ${userId}:`, workoutDays);
      return res.status(500).json({
        error: "Invalid workout plan format",
        message: "Generated workout plan is invalid. Please try again."
      });
    }

    // Check if user already has a workout plan and update it, or create new one
    let workoutPlan = await WorkoutPlan.findOne({ userId }).sort({ createdAt: -1 });

    if (workoutPlan) {
      console.log(`Updating existing workout plan for user: ${userId}`);
      // Update existing plan
      workoutPlan.workoutDays = workoutDays;
      workoutPlan.date = new Date();
      await workoutPlan.save();
    } else {
      console.log(`Creating new workout plan for user: ${userId}`);
      // Create new plan
      workoutPlan = await WorkoutPlan.create({
        userId,
        date: new Date(),
        workoutDays
      });
    }

    console.log(`Workout plan saved successfully for user: ${userId}`);
    res.status(201).json({
      success: true,
      message: "Workout plan generated successfully",
      workoutPlan: {
        _id: workoutPlan._id,
        userId: workoutPlan.userId,
        date: workoutPlan.date,
        workoutDays: workoutPlan.workoutDays
      }
    });

  } catch (error) {
    console.error(`Create workout plan error for user ${req.user?.id}:`, error);
    res.status(500).json({
      error: "Internal server error",
      message: "Failed to create workout plan. Please try again."
    });
  }
};

const getCurrentWorkoutPlan = async (req, res) => {
  try {
    const userId = req.user.id;

    const workoutPlan = await WorkoutPlan.findOne({ userId })
      .sort({ createdAt: -1 })
      .limit(1);

    if (!workoutPlan) {
      return res.status(404).json({
        error: "No workout plan found",
        message: "No workout plan found for user"
      });
    }

    res.status(200).json({
      success: true,
      workoutPlan: {
        _id: workoutPlan._id,
        userId: workoutPlan.userId,
        date: workoutPlan.date,
        workoutDays: workoutPlan.workoutDays
      }
    });

  } catch (error) {
    console.error('Get current workout plan error:', error);
    res.status(500).json({
      error: "Internal server error",
      message: "Failed to retrieve workout plan"
    });
  }
};

const updateWorkoutPlan = async (req, res) => {
  try {
    const userId = req.user.id;
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({
        error: "Missing prompt",
        message: "Prompt is required"
      });
    }

    const profile = await Profile.findOne({ user: userId });
    if (!profile) {
      return res.status(404).json({
        error: "User profile not found",
        message: "Please complete your profile first"
      });
    }

    // Validate that profile has all required fields
    const requiredFields = ['age', 'gender', 'height', 'weight', 'goal', 'activityLevel'];
    const missingFields = requiredFields.filter(field => !profile[field]);

    if (missingFields.length > 0) {
      return res.status(400).json({
        error: "Incomplete profile",
        message: `Please complete your profile. Missing fields: ${missingFields.join(', ')}`,
        missingFields
      });
    }

    let workoutDays;
    try {
      workoutDays = await generateWorkoutPlan(profile, prompt);
    } catch (genError) {
      console.error('Workout generation error:', genError);
      return res.status(500).json({
        error: "Workout generation failed",
        message: "Failed to generate workout plan. Please try again later."
      });
    }

    // Validate workout days structure
    if (!workoutDays || !Array.isArray(workoutDays) || workoutDays.length !== 7) {
      return res.status(500).json({
        error: "Invalid workout plan format",
        message: "Generated workout plan is invalid. Please try again."
      });
    }

    const existingPlan = await WorkoutPlan.findOne({ userId })
      .sort({ createdAt: -1 })
      .limit(1);

    let updatedPlan;
    if (existingPlan) {
      existingPlan.workoutDays = workoutDays;
      existingPlan.date = new Date();
      await existingPlan.save();
      updatedPlan = existingPlan;
    } else {
      updatedPlan = await WorkoutPlan.create({
        userId,
        date: new Date(),
        workoutDays
      });
    }

    res.status(200).json({
      success: true,
      message: "Workout plan updated successfully",
      workoutPlan: {
        _id: updatedPlan._id,
        userId: updatedPlan.userId,
        date: updatedPlan.date,
        workoutDays: updatedPlan.workoutDays
      }
    });

  } catch (error) {
    console.error('Update workout plan error:', error);
    res.status(500).json({
      error: "Internal server error",
      message: "Failed to update workout plan"
    });
  }
};

module.exports = { createWorkoutPlan, getCurrentWorkoutPlan, updateWorkoutPlan };
