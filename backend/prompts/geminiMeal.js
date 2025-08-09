const axios = require("axios");
require("dotenv").config();

const generateMealPlan = async (profile, userPrompt = null, isWeekly = false) => {
  // Check if this is a single meal request for updating
  const isSingleMealRequest = profile.singleMealRequest;

  if (isSingleMealRequest) {
    // Generate a single meal based on the specific request
    const { day, mealType, userPrompt: mealPrompt } = isSingleMealRequest;

    const singleMealPrompt = `
Create a single meal for ${day}'s ${mealType} based on the user's request: "${mealPrompt}"

User Profile:
- Age: ${profile.age}
- Gender: ${profile.gender}
- Height: ${profile.height} cm
- Weight: ${profile.weight} kg
- Goal: ${profile.goal}
- Activity Level: ${profile.activityLevel}

Generate ONLY ONE meal that:
1. Fits the user's specific request: "${mealPrompt}"
2. Is appropriate for ${mealType}
3. Maintains nutritional balance
4. Suits the user's profile and goals

Respond ONLY in the following JSON format:
{
  "meals": [
    {
      "type": "${mealType}",
      "name": "Creative meal name",
      "calories": 300,
      "macros": { "protein": 20, "carbs": 30, "fat": 15 },
      "ingredients": ["ingredient1", "ingredient2", "ingredient3"]
    }
  ]
}
`;

    try {
      console.log('Generating single meal with prompt:', singleMealPrompt);

      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
        {
          contents: [
            {
              parts: [{ text: singleMealPrompt }],
            },
          ],
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          timeout: 30000,
        }
      );

      console.log('Single meal generation response received');
      const text = response.data.candidates[0].content.parts[0].text;

      // Extract JSON from the response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const mealData = JSON.parse(jsonMatch[0]);
        console.log('Single meal generated successfully:', mealData);
        return mealData;
      } else {
        throw new Error("Invalid JSON response from AI");
      }
    } catch (error) {
      console.error('Single meal generation failed:', error);
      throw error;
    }
  }

  // Original weekly/daily meal plan generation logic
  let basePrompt = `
Create a ${isWeekly ? 'weekly' : 'daily'} meal plan for a user with the following profile:
- Age: ${profile.age}
- Gender: ${profile.gender}
- Height: ${profile.height} cm
- Weight: ${profile.weight} kg
- Goal: ${profile.goal}
- Activity Level: ${profile.activityLevel}

${isWeekly ? 'Generate 7 different days with varied meals. Each day should have breakfast, lunch, dinner, and snack. Ensure variety and no repetition of main dishes across the week.' : 'Generate one day with breakfast, lunch, dinner, and snack.'}
`;

  if (userPrompt) {
    basePrompt += `\n\nUser's specific request: ${userPrompt}\n\nPlease modify the meal plan according to this request while maintaining nutritional balance.`;
  }

  const prompt = basePrompt + `

Respond ONLY in the following JSON format:

${isWeekly ? `
{
  "weeklyPlan": [
    {
      "day": "Monday",
      "meals": [
        {
          "type": "breakfast",
          "name": "Oatmeal with banana",
          "calories": 350,
          "macros": { "protein": 12, "carbs": 45, "fat": 8 },
          "ingredients": ["oats", "banana", "milk"]
        },
        {
          "type": "lunch",
          "name": "Grilled chicken salad",
          "calories": 450,
          "macros": { "protein": 35, "carbs": 15, "fat": 25 },
          "ingredients": ["chicken breast", "mixed greens", "olive oil"]
        },
        {
          "type": "dinner",
          "name": "Salmon with vegetables",
          "calories": 380,
          "macros": { "protein": 28, "carbs": 20, "fat": 22 },
          "ingredients": ["salmon", "broccoli", "quinoa"]
        },
        {
          "type": "snack",
          "name": "Greek yogurt with berries",
          "calories": 150,
          "macros": { "protein": 15, "carbs": 12, "fat": 5 },
          "ingredients": ["greek yogurt", "berries", "honey"]
        }
      ]
    },
    ... (repeat for all 7 days with different meals)
  ]
}` : `
{
  "meals": [
    {
      "type": "breakfast",
      "name": "Oatmeal with banana",
      "calories": 350,
      "macros": { "protein": 12, "carbs": 45, "fat": 8 },
      "ingredients": ["oats", "banana", "milk"]
    },
    ...
  ]
}`}
`;

  try {
    console.log('Sending request to Gemini API...');
    console.log('API Key exists:', !!process.env.GEMINI_API_KEY);

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
        timeout: 30000, // 30 second timeout
      }
    );

    console.log('Gemini API response received');
    const text = response.data.candidates?.[0]?.content?.parts?.[0]?.text || "";

    // Extract first JSON object from the response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Model did not return JSON");
    }

    const data = JSON.parse(jsonMatch[0]);

    // Basic validation/coercion
    if (isWeekly) {
      if (!Array.isArray(data.weeklyPlan)) throw new Error("Invalid weekly JSON");
    } else {
      if (!Array.isArray(data.meals)) throw new Error("Invalid daily JSON");
    }

    return data;
  } catch (err) {
    console.error('Gemini parsing error:', err);
    throw err;
  }
};

const generateFallbackMealPlan = (profile, isWeekly) => {
  console.log('Generating fallback meal plan');

  const baseMeals = [
    {
      type: "breakfast",
      name: "Oatmeal with berries and nuts",
      calories: 350,
      macros: { protein: 12, carbs: 45, fat: 8 },
      ingredients: ["oats", "berries", "nuts", "milk"]
    },
    {
      type: "lunch",
      name: "Grilled chicken salad",
      calories: 450,
      macros: { protein: 35, carbs: 15, fat: 25 },
      ingredients: ["chicken breast", "mixed greens", "olive oil", "vegetables"]
    },
    {
      type: "dinner",
      name: "Salmon with quinoa and vegetables",
      calories: 380,
      macros: { protein: 28, carbs: 20, fat: 22 },
      ingredients: ["salmon", "quinoa", "broccoli", "carrots"]
    },
    {
      type: "snack",
      name: "Greek yogurt with honey",
      calories: 150,
      macros: { protein: 15, carbs: 12, fat: 5 },
      ingredients: ["greek yogurt", "honey", "berries"]
    }
  ];

  if (isWeekly) {
    const weekDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    const weeklyPlan = weekDays.map((day, index) => {
      // Modify meals slightly for each day to add variety
      const dayMeals = baseMeals.map(meal => ({
        ...meal,
        name: `${meal.name} (${day})`,
        calories: meal.calories + (index * 10), // Slight variation
        ingredients: [...meal.ingredients, `day-${index + 1}-special`]
      }));

      return {
        day,
        meals: dayMeals
      };
    });

    return weeklyPlan;
  } else {
    return baseMeals;
  }
};

module.exports = generateMealPlan;
