const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique:true
  },
  age: Number,
  gender: { type: String, enum: ['male', 'female'] },
  height: Number, // cm
  weight: Number, // kg
  goal: { type: String, enum: ['weight_loss', 'muscle_gain', 'maintenance'] },
  activityLevel: { type: String, enum: ['low', 'moderate', 'high'] },
}, { timestamps: true });

module.exports = mongoose.model('Profile', profileSchema);
