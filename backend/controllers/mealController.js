const MealPlan = require('../models/Meal');
const Profile = require('../models/Profile');
const generateMealPlan = require('../utils/geminiMeal');

const createMealPlan = async (req, res) => {
  const userId = req.user.id;

  const profile = await Profile.findOne({ user: userId });
  if (!profile) {
    res.status(404);
    throw new Error('User profile not found');
  }

  const meals = await generateMealPlan(profile);

 const mealPlan = await MealPlan.create({
  userId,
  date: new Date(),
  meals
});


  res.status(201).json(mealPlan);
};

const getCurrentMealPlan = async (req, res) => {
  const userId = req.user.id;

  const mealPlan = await MealPlan.findOne({ userId })
    .sort({ createdAt: -1 }) 
    .limit(1);

  if (!mealPlan) {
    res.status(404);
    throw new Error('No meal plan found for user');
  }

  res.status(200).json(mealPlan);
};

const updateMealPlan = async (req, res) => {
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

  const meals = await generateMealPlan(profile, prompt);

  const existingPlan = await MealPlan.findOne({ userId })
    .sort({ createdAt: -1 })
    .limit(1);

  if (existingPlan) {
    existingPlan.meals = meals;
    existingPlan.date = new Date();
    await existingPlan.save();
    res.status(200).json(existingPlan);
  } else {
    const newMealPlan = await MealPlan.create({
      userId,
      date: new Date(),
      meals
    });
    res.status(201).json(newMealPlan);
  }
};

module.exports = { createMealPlan, getCurrentMealPlan, updateMealPlan };
