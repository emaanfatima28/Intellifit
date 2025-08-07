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
  const prompt =
    basePrompt +
    `Workout plan must include 7 days (Monday to Sunday), each with a list of exercises. Each day must be present in the output, even if it is a rest or light day. Each day object must have:
- day (e.g. "Monday")
- exercises: list of objects with:
  - name (string)
  - sets (number)
  - reps (number)
  - category: cardio | strength | flexibility

⚠ STRICT RULES:
- You MUST return all 7 days: Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday.
- If you do not return all 7 days, your answer is INVALID.
- Use only numbers for sets/reps.
- Do NOT use values like "AsManyAsPossible", "Few Minutes", etc.
- Do NOT include explanations, markdown, or any text outside the JSON.
- Only respond with raw valid JSON.
- Cover the full week (Monday to Sunday).


Example format (all 7 days):
{
  "workoutDays": [
    { "day": "Monday", "exercises": [ { "name": "Squats", "sets": 3, "reps": 12, "category": "strength" } ] },
    { "day": "Tuesday", "exercises": [ { "name": "Push Ups", "sets": 3, "reps": 10, "category": "strength" } ] },
    { "day": "Wednesday", "exercises": [ { "name": "Jogging", "sets": 1, "reps": 20, "category": "cardio" } ] },
    { "day": "Thursday", "exercises": [ { "name": "Plank", "sets": 3, "reps": 30, "category": "strength" } ] },
    { "day": "Friday", "exercises": [ { "name": "Lunges", "sets": 3, "reps": 12, "category": "strength" } ] },
    { "day": "Saturday", "exercises": [ { "name": "Yoga", "sets": 2, "reps": 15, "category": "flexibility" } ] },
    { "day": "Sunday", "exercises": [ { "name": "Rest", "sets": 0, "reps": 0, "category": "flexibility" } ] }
  ]
}

Before responding, CHECKLIST:
- [ ] Did you include all 7 days (Monday to Sunday)?
- [ ] Is each day unique?
- [ ] Is the output valid JSON with no extra text?
If not, regenerate your answer until all requirements are met.
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
    console.error(
      "Gemini JSON parse failed or API error:\n",
      error.response?.data || error.message
    );
    throw new Error("Failed to generate workout plan");
  }
};

module.exports = generateWorkoutPlan;
