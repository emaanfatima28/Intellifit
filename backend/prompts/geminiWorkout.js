const axios = require("axios");
require("dotenv").config();

const generateWorkoutPlan = async (profile, userPrompt = null) => {
  let basePrompt = `
Create a 1-day workout plan for:
- Age: ${profile.age}
- Gender: ${profile.gender}
- Height: ${profile.height} cm
- Weight: ${profile.weight} kg
- Goal: ${profile.goal}
- Activity Level: ${profile.activityLevel}
`;

  if (userPrompt) {
    basePrompt += `\n\nUser's specific request: ${userPrompt}\n\nPlease modify the workout plan according to this request while maintaining fitness effectiveness.`;
  }

  const prompt = basePrompt + `

Workout should include:
- day (e.g. "Monday")
- exercises: list of objects with:
  - name (string)
  - sets (number)
  - reps (number)
  - category: cardio | strength | flexibility

⚠ Rules:
- Use only numbers for sets/reps.
- Do NOT use values like "AsManyAsPossible", "Few Minutes", etc.
- Do NOT include explanations, markdown, or any text outside the JSON.
- Only respond with raw valid JSON.

Example format:
{
  "workoutDays": [
    {
      "day": "Monday",
      "exercises": [
        {
          "name": "Squats",
          "sets": 3,
          "reps": 12,
          "category": "strength"
        }
      ]
    }
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
    return parsed.workoutDays;

  } catch (error) {
    console.error("Gemini JSON parse failed or API error:\n", error.response?.data || error.message);
    throw new Error("Failed to generate workout plan");
  }
};

module.exports = generateWorkoutPlan;
