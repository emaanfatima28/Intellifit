const MealPlan = require('../models/Meal');
const Profile = require('../models/Profile');
const generateMealPlan = require('../prompts/geminiMeal');

const createMealPlan = async (req, res) => {
  try {
    const userId = req.user.id;
    const { planType = 'weekly' } = req.body;

    const profile = await Profile.findOne({ user: userId });
    if (!profile) {
      return res.status(404).json({ error: 'User profile not found' });
    }

    if (planType === 'weekly') {
      const weeklyPlan = await generateMealPlan(profile, null, true);

      const mealPlan = await MealPlan.create({
        userId,
        date: new Date(),
        planType: 'weekly',
        weeklyPlan
      });

      return res.status(201).json(mealPlan);
    } else {
      const meals = await generateMealPlan(profile, null, false);

      const mealPlan = await MealPlan.create({
        userId,
        date: new Date(),
        planType: 'daily',
        meals
      });

      return res.status(201).json(mealPlan);
    }
  } catch (error) {
    console.error('Error creating meal plan:', error);
    return res.status(500).json({ error: 'Failed to create meal plan: ' + error.message });
  }
};

const getCurrentMealPlan = async (req, res) => {
  try {
    const userId = req.user.id;

    const mealPlan = await MealPlan.findOne({ userId })
      .sort({ createdAt: -1 })
      .limit(1);

    if (!mealPlan) {
      return res.status(404).json({ error: 'No meal plan found for user' });
    }

    return res.status(200).json(mealPlan);
  } catch (error) {
    console.error('Error getting current meal plan:', error);
    return res.status(500).json({ error: 'Failed to get meal plan: ' + error.message });
  }
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

const generateWeeklyMealPlan = async (req, res) => {
  try {
    const userId = req.user.id;
    const { userPrompt = null } = req.body;

    console.log('Generating weekly meal plan for user:', userId);

    const profile = await Profile.findOne({ user: userId });
    if (!profile) {
      console.log('Profile not found for user:', userId);
      return res.status(404).json({ error: 'User profile not found' });
    }

    console.log('Profile found:', profile);

    const weeklyPlan = await generateMealPlan(profile, userPrompt, true);
    console.log('Weekly plan generated:', weeklyPlan);

    // Check if user already has a weekly plan
    const existingPlan = await MealPlan.findOne({
      userId,
      planType: 'weekly'
    }).sort({ createdAt: -1 });

    if (existingPlan) {
      existingPlan.weeklyPlan = weeklyPlan;
      existingPlan.date = new Date();
      await existingPlan.save();
      console.log('Updated existing meal plan');
      return res.status(200).json(existingPlan);
    } else {
      const mealPlan = await MealPlan.create({
        userId,
        date: new Date(),
        planType: 'weekly',
        weeklyPlan
      });
      console.log('Created new meal plan');
      return res.status(201).json(mealPlan);
    }
  } catch (error) {
    console.error('Error generating weekly meal plan:', error);
    return res.status(500).json({ error: 'Failed to generate weekly meal plan: ' + error.message });
  }
};

module.exports = { createMealPlan, getCurrentMealPlan, updateMealPlan, generateWeeklyMealPlan };
