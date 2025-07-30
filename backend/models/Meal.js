const mongoose = require('mongoose');

const mealPlanSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },
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
  feedbackGiven: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('MealPlan', mealPlanSchema);
