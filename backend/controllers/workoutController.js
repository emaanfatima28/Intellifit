const WorkoutPlan = require('../models/Workout');
const Profile = require('../models/Profile');
const generateWorkoutPlan = require('../prompts/geminiWorkout');

const createWorkoutPlan = async (req, res) => {
  const userId = req.user.id;

  const profile = await Profile.findOne({ user: userId });
  if (!profile) {
    res.status(404);
    throw new Error("User profile not found");
  }

  const workoutDays = await generateWorkoutPlan(profile);

  const workoutPlan = await WorkoutPlan.create({
    userId,
    date: new Date(),
    workoutDays
  });

  res.status(201).json(workoutPlan);
};

const getCurrentWorkoutPlan = async (req, res) => {
  const userId = req.user.id;

  const workoutPlan = await WorkoutPlan.findOne({ userId })
    .sort({ createdAt: -1 }) 
    .limit(1);

  if (!workoutPlan) {
    res.status(404);
    throw new Error('No workout plan found for user');
  }

  res.status(200).json(workoutPlan);
};

const updateWorkoutPlan = async (req, res) => {
  const userId = req.user.id;
  const { prompt } = req.body;

  if (!prompt) {
    res.status(400);
    throw new Error('Prompt is required');
  }

  const profile = await Profile.findOne({ user: userId });
  if (!profile) {
    res.status(404);
    throw new Error('User profile not found');
  }

  const workoutDays = await generateWorkoutPlan(profile, prompt);

  const existingPlan = await WorkoutPlan.findOne({ userId })
    .sort({ createdAt: -1 })
    .limit(1);

  if (existingPlan) {
    existingPlan.workoutDays = workoutDays;
    existingPlan.date = new Date();
    await existingPlan.save();
    res.status(200).json(existingPlan);
  } else {
    const newWorkoutPlan = await WorkoutPlan.create({
      userId,
      date: new Date(),
      workoutDays
    });
    res.status(201).json(newWorkoutPlan);
  }
};

module.exports = { createWorkoutPlan, getCurrentWorkoutPlan, updateWorkoutPlan };
