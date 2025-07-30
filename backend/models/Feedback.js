const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  planType: { type: String, enum: ['meal', 'workout'], required: true },
  planId: { type: mongoose.Schema.Types.ObjectId, required: true }, 
  rating: { type: Number, min: 1, max: 5 },
  comments: String,
  submittedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Feedback', feedbackSchema);
