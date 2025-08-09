const MealPlan = require('../models/Meal');
const Profile = require('../models/Profile');
const generateMealPlan = require('../prompts/geminiMeal');
const axios = require('axios'); // Added axios for Gemini API call

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

const updateSpecificMeal = async (req, res) => {
  try {
    const userId = req.user.id;
    const { prompt, day, mealType } = req.body;

    if (!prompt || !day || !mealType) {
      return res.status(400).json({
        error: "Missing required fields",
        message: "Prompt, day, and mealType are required",
      });
    }

    const profile = await Profile.findOne({ user: userId });
    if (!profile) {
      return res.status(404).json({
        error: "User profile not found",
        message: "Please complete your profile first",
      });
    }

    // Find latest plan
    const existingPlan = await MealPlan.findOne({ userId }).sort({ createdAt: -1 }).limit(1);
    if (!existingPlan) {
      return res.status(404).json({
        error: "No meal plan found",
        message: "Please generate a meal plan first",
      });
    }

    if (existingPlan.planType !== "weekly") {
      return res.status(400).json({
        error: "Invalid plan type",
        message: "This feature is only available for weekly meal plans",
      });
    }

    // Build AI request for a single meal
    const specificPrompt = `Generate ONLY ONE meal for ${day}'s ${mealType}. Keep name concise (max 60 chars, 4-7 words). Use realistic calories and macros. Ingredients should be 4-8 common items. User request: ${prompt}. Return strict JSON only.`;

    let newMeal;
    try {
      const tempProfile = {
        ...profile.toObject(),
        singleMealRequest: { day, mealType, userPrompt: prompt },
      };

      const generated = await generateMealPlan(tempProfile, specificPrompt, false);

      if (!generated || !Array.isArray(generated.meals) || generated.meals.length === 0) {
        return res.status(502).json({
          error: "Generation failed",
          message: "Could not generate a new meal. Please try again.",
        });
      }

      // Prefer matching type; otherwise take first and coerce type
      newMeal = generated.meals.find((m) => m.type === mealType) || {
        ...generated.meals[0],
        type: mealType,
      };

      // Sanitize/validate
      const safeNumber = (v, fallback) => (Number.isFinite(Number(v)) ? Number(v) : fallback);
      newMeal.name = String(newMeal.name || "").slice(0, 60).trim();
      newMeal.type = mealType;
      newMeal.calories = safeNumber(newMeal.calories, 350);
      const macros = newMeal.macros || {};
      newMeal.macros = {
        protein: safeNumber(macros.protein, 20),
        carbs: safeNumber(macros.carbs, 30),
        fat: safeNumber(macros.fat, 15),
      };
      newMeal.ingredients = (Array.isArray(newMeal.ingredients) ? newMeal.ingredients : [])
        .map((i) => String(i).trim())
        .filter(Boolean)
        .slice(0, 8);

      if (!newMeal.name) {
        return res.status(502).json({
          error: "Invalid generation",
          message: "Generated meal was invalid. Please try again.",
        });
      }
    } catch (e) {
      console.error("AI meal generation error:", e);
      return res.status(502).json({
        error: "Generation failed",
        message: "We couldn't generate a new meal right now. Please try again in a moment.",
      });
    }

    // Locate day/meal indices
    const dayIndex = existingPlan.weeklyPlan.findIndex((d) => d.day === day);
    if (dayIndex === -1) {
      return res.status(400).json({ error: "Invalid day", message: "Specified day not found in meal plan" });
    }
    const mealIndex = existingPlan.weeklyPlan[dayIndex].meals.findIndex((m) => m.type === mealType);
    if (mealIndex === -1) {
      return res.status(400).json({ error: "Invalid meal type", message: "Specified meal type not found for this day" });
    }

    // Persist update
    existingPlan.weeklyPlan[dayIndex].meals[mealIndex] = newMeal;
    existingPlan.date = new Date();
    await existingPlan.save();

    return res.status(200).json({
      success: true,
      message: `Successfully updated ${day}'s ${mealType}`,
      mealPlan: existingPlan,
    });
  } catch (error) {
    console.error("Update specific meal error:", error);
    return res.status(500).json({
      error: "Internal server error",
      message: "Failed to update meal. Please try again.",
    });
  }
};

const updateMealPlan = async (req, res) => {
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

    console.log(`Updating meal plan for user ${userId} with prompt: ${prompt}`);

    // Generate new meal plan based on user prompt
    let updatedMeals;
    try {
      updatedMeals = await generateMealPlan(profile, prompt, false);
    } catch (genError) {
      console.error('Meal generation error:', genError);
      return res.status(500).json({
        error: "Meal generation failed",
        message: "Failed to generate updated meal. Please try again later."
      });
    }

    // Find existing meal plan
    const existingPlan = await MealPlan.findOne({ userId })
      .sort({ createdAt: -1 })
      .limit(1);

    let updatedPlan;
    if (existingPlan) {
      // Update existing plan
      if (existingPlan.planType === 'weekly') {
        // For weekly plans, we need to update the specific meal mentioned in the prompt
        // This is a simplified approach - in a real app you'd parse the prompt to identify the specific meal
        existingPlan.weeklyPlan = await generateMealPlan(profile, prompt, true);
      } else {
        // For daily plans, update the meals
        existingPlan.meals = updatedMeals;
      }
      existingPlan.date = new Date();
      await existingPlan.save();
      updatedPlan = existingPlan;
    } else {
      // Create new plan if none exists
      updatedPlan = await MealPlan.create({
        userId,
        date: new Date(),
        planType: 'daily',
        meals: updatedMeals
      });
    }

    console.log(`Meal plan updated successfully for user ${userId}`);

    res.status(200).json({
      success: true,
      message: "Meal plan updated successfully",
      mealPlan: updatedPlan
    });

  } catch (error) {
    console.error('Update meal plan error:', error);
    res.status(500).json({
      error: "Internal server error",
      message: "Failed to update meal plan. Please try again."
    });
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

module.exports = { createMealPlan, getCurrentMealPlan, updateMealPlan, generateWeeklyMealPlan, updateSpecificMeal };
