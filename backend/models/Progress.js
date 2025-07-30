const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, default: Date.now },
  
  weight: Number, // in kg  
  waist: Number, // in inches
  arms: Number, // in inches
  thighs: Number, // in inches
  notes: String
}, { timestamps: true });

module.exports = mongoose.model('Progress', progressSchema);
