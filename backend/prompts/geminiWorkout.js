const axios = require("axios");
require("dotenv").config();

// Fallback workout plan generator
const generateFallbackWorkoutPlan = (profile) => {
  const { goal, activityLevel } = profile;

  // Base exercises for different categories
  const strengthExercises = [
    { name: "Push-ups", sets: 3, reps: 10, category: "strength" },
    { name: "Squats", sets: 3, reps: 12, category: "strength" },
    { name: "Lunges", sets: 3, reps: 10, category: "strength" },
    { name: "Plank", sets: 3, reps: 30, category: "strength" },
    { name: "Mountain Climbers", sets: 3, reps: 20, category: "strength" }
  ];

  const cardioExercises = [
    { name: "Jogging in Place", sets: 1, reps: 5, category: "cardio" },
    { name: "Jumping Jacks", sets: 3, reps: 15, category: "cardio" },
    { name: "High Knees", sets: 3, reps: 20, category: "cardio" },
    { name: "Burpees", sets: 3, reps: 8, category: "cardio" }
  ];

  const flexibilityExercises = [
    { name: "Arm Circles", sets: 2, reps: 10, category: "flexibility" },
    { name: "Leg Stretches", sets: 2, reps: 15, category: "flexibility" },
    { name: "Yoga Stretches", sets: 2, reps: 15, category: "flexibility" }
  ];

  // Adjust intensity based on activity level
  const getIntensity = () => {
    switch (activityLevel) {
      case 'low': return { sets: 2, reps: 8 };
      case 'moderate': return { sets: 3, reps: 12 };
      case 'high': return { sets: 4, reps: 15 };
      default: return { sets: 3, reps: 10 };
    }
  };

  const intensity = getIntensity();

  // Create workout plan based on goal
  const createDayPlan = (day, exercises) => {
    return {
      day,
      exercises: exercises.map(ex => ({
        ...ex,
        sets: intensity.sets,
        reps: intensity.reps
      }))
    };
  };

  const workoutDays = [
    createDayPlan("Monday", strengthExercises.slice(0, 2)),
    createDayPlan("Tuesday", cardioExercises.slice(0, 2)),
    createDayPlan("Wednesday", strengthExercises.slice(2, 4)),
    createDayPlan("Thursday", cardioExercises.slice(2, 4)),
    createDayPlan("Friday", strengthExercises.slice(0, 2).concat(cardioExercises.slice(0, 1))),
    createDayPlan("Saturday", flexibilityExercises),
    createDayPlan("Sunday", [{ name: "Rest", sets: 0, reps: 0, category: "rest" }])
  ];

  return workoutDays;
};

const generateWorkoutPlan = async (profile, userPrompt = null) => {
  // Validate profile data
  if (!profile || !profile.age || !profile.gender || !profile.height || !profile.weight || !profile.goal || !profile.activityLevel) {
    throw new Error("Incomplete profile data provided");
  }

  let basePrompt = `
Create a 7-day workout plan for:
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

IMPORTANT: You must return a valid JSON object with exactly 7 workout days (Monday through Sunday).

Each workout day must include:
- day: the day name (Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday)
- exercises: an array of exercise objects, each containing:
  - name: exercise name (string)
  - sets: number of sets (number only, no text)
  - reps: number of repetitions (number only, no text)
  - category: one of "cardio", "strength", "flexibility", or "rest"

REQUIREMENTS:
1. Return ALL 7 days: Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday
2. Use only numbers for sets and reps (no text like "AsManyAsPossible")
3. Each day must have at least one exercise (except rest days)
4. Rest days should have one exercise with name "Rest", sets: 0, reps: 0, category: "rest"
5. Return ONLY valid JSON - no explanations, markdown, or extra text
6. Ensure the workout plan is appropriate for the user's age, fitness level, and goals

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
        },
        {
          "name": "Push-ups",
          "sets": 3,
          "reps": 10,
          "category": "strength"
        }
      ]
    },
    {
      "day": "Tuesday",
      "exercises": [
        {
          "name": "Jogging",
          "sets": 1,
          "reps": 20,
          "category": "cardio"
        }
      ]
    },
    {
      "day": "Wednesday",
      "exercises": [
        {
          "name": "Plank",
          "sets": 3,
          "reps": 30,
          "category": "strength"
        }
      ]
    },
    {
      "day": "Thursday",
      "exercises": [
        {
          "name": "Lunges",
          "sets": 3,
          "reps": 12,
          "category": "strength"
        }
      ]
    },
    {
      "day": "Friday",
      "exercises": [
        {
          "name": "Burpees",
          "sets": 3,
          "reps": 8,
          "category": "cardio"
        }
      ]
    },
    {
      "day": "Saturday",
      "exercises": [
        {
          "name": "Yoga Stretches",
          "sets": 2,
          "reps": 15,
          "category": "flexibility"
        }
      ]
    },
    {
      "day": "Sunday",
      "exercises": [
        {
          "name": "Rest",
          "sets": 0,
          "reps": 0,
          "category": "rest"
        }
      ]
    }
  ]
}

Remember: Return ONLY the JSON object, no other text or explanations.`;

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
        timeout: 30000, // 30 second timeout
      }
    );

    if (!response.data || !response.data.candidates || !response.data.candidates[0] || !response.data.candidates[0].content) {
      throw new Error("Invalid response from Gemini API");
    }

    const text = response.data.candidates[0].content.parts[0].text;

    // Extract JSON from response
    const start = text.indexOf("{");
    const end = text.lastIndexOf("}") + 1;

    if (start === -1 || end === 0) {
      throw new Error("No valid JSON found in response");
    }

    const jsonText = text.slice(start, end);

    try {
      const parsed = JSON.parse(jsonText);

      // Validate the structure
      if (!parsed.workoutDays || !Array.isArray(parsed.workoutDays)) {
        throw new Error("Invalid workout plan structure");
      }

      if (parsed.workoutDays.length !== 7) {
        throw new Error("Workout plan must contain exactly 7 days");
      }

      // Validate each day
      const expectedDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
      for (let i = 0; i < 7; i++) {
        const day = parsed.workoutDays[i];
        if (!day.day || !day.exercises || !Array.isArray(day.exercises)) {
          throw new Error(`Invalid structure for day ${i + 1}`);
        }
        if (day.day !== expectedDays[i]) {
          throw new Error(`Day ${i + 1} should be ${expectedDays[i]}, got ${day.day}`);
        }
      }

      return parsed.workoutDays;
    } catch (parseError) {
      console.error("JSON parsing error:", parseError);
      console.error("Raw response text:", text);
      throw new Error("Failed to parse workout plan response");
    }

  } catch (error) {
    console.error("Gemini API error:", error.response?.data || error.message);

    // If Gemini API fails, use fallback workout plan
    console.log("Using fallback workout plan due to API error");
    return generateFallbackWorkoutPlan(profile);
  }
};

module.exports = generateWorkoutPlan;
