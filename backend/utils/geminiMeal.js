const axios = require("axios");
require("dotenv").config();

const generateMealPlan = async (profile, userPrompt = null) => {
  let basePrompt = `
Create a healthy daily meal plan (breakfast, lunch, dinner, snack) for a user with the following profile:
- Age: ${profile.age}
- Gender: ${profile.gender}
- Height: ${profile.height} cm
- Weight: ${profile.weight} kg
- Goal: ${profile.goal}
- Activity Level: ${profile.activityLevel}
`;

  if (userPrompt) {
    basePrompt += `\n\nUser's specific request: ${userPrompt}\n\nPlease modify the meal plan according to this request while maintaining nutritional balance.`;
  }

  const prompt = basePrompt + `

Respond ONLY in the following JSON format:

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
}
`;

  try {
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
      }
    );

    const text = response.data.candidates[0].content.parts[0].text;

    const start = text.indexOf("{");
    const end = text.lastIndexOf("}") + 1;
    const jsonText = text.slice(start, end);
    const parsed = JSON.parse(jsonText);
    return parsed.meals;

  } catch (error) {
    console.error("Gemini JSON parse failed or API error:\n", error.response?.data || error.message);
    throw new Error("Failed to generate meal plan");
  }
};

module.exports = generateMealPlan;
