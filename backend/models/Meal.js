const mongoose = require('mongoose');

const mealPlanSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },
  planType: { type: String, enum: ['daily', 'weekly'], default: 'daily' },
  meals: [{
    type: { type: String, enum: ['breakfast', 'lunch', 'dinner', 'snack'], required: true },
    name: String,
    calories: Number,
    macros: {
      protein: Number,
      carbs: Number,
      fat: Number
    },
    ingredients: [String],
  }],
  weeklyPlan: [{
    day: { type: String, enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] },
    meals: [{
      type: { type: String, enum: ['breakfast', 'lunch', 'dinner', 'snack'], required: true },
      name: String,
      calories: Number,
      macros: {
        protein: Number,
        carbs: Number,
        fat: Number
      },
      ingredients: [String],
    }]
  }],
  feedbackGiven: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('MealPlan', mealPlanSchema);
