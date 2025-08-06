const axios = require("axios");
require("dotenv").config();

const generateMealPlan = async (profile, userPrompt = null, isWeekly = false) => {
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
    const text = response.data.candidates[0].content.parts[0].text;
    console.log('Raw response text:', text.substring(0, 200) + '...');

    const start = text.indexOf("{");
    const end = text.lastIndexOf("}") + 1;
    
    if (start === -1 || end === 0) {
      console.error('No JSON found in response');
      throw new Error('Invalid response format from AI');
    }
    
    const jsonText = text.slice(start, end);
    console.log('Extracted JSON:', jsonText.substring(0, 200) + '...');
    
    const parsed = JSON.parse(jsonText);

    if (isWeekly) {
      return parsed.weeklyPlan;
    } else {
      return parsed.meals;
    }

  } catch (error) {
    console.error("Gemini API error:", error.message);
    if (error.response) {
      console.error("Response status:", error.response.status);
      console.error("Response data:", error.response.data);
    }
    
    // Return fallback meal plan if AI fails
    console.log('Using fallback meal plan');
    return generateFallbackMealPlan(profile, isWeekly);
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
