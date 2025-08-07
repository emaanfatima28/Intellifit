const mongoose = require('mongoose');
const workoutPlanSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },
  workoutDays: [{
    day: { type: String },
    exercises: [{
      name: String,
      sets: Number,
      reps: Number,
      category: { type: String, enum: ['cardio', 'strength', 'flexibility', 'rest'] }
    }]
  }],
  feedbackGiven: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('WorkoutPlan', workoutPlanSchema);
