const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name:{type: String, required: true},
  email: { type: String, unique: true, required: true, match: [/^([a-zA-Z0-9_\-.+]+)@([a-zA-Z0-9\-.]+)\.([a-zA-Z]{2,})$/, 'Please fill a valid email address'] },
  password: { type: String, required: true }, 
  profile: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Profile'
  },
  resetPasswordToken: String,
  resetPasswordExpires: Date
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
