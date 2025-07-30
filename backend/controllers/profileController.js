const Profile = require('../models/Profile');

const createOrUpdateProfile = async (req, res) => {
  const { age, gender, height, weight, goal, activityLevel } = req.body;
  const userId = req.user.id;

  const existingProfile = await Profile.findOne({ user: userId });

  if (existingProfile) {
    existingProfile.age = age;
    existingProfile.gender = gender;
    existingProfile.height = height;
    existingProfile.weight = weight;
    existingProfile.goal = goal;
    existingProfile.activityLevel = activityLevel;

    await existingProfile.save();
    res.json({ message: 'Profile updated', profile: existingProfile });
  } else {
   
    const profile = await Profile.create({
      user: userId,
      age,
      gender,
      height,
      weight,
      goal,
      activityLevel
    });

    res.status(201).json({ message: 'Profile created', profile });
  }
};

const getProfile = async (req, res) => {
  const profile = await Profile.findOne({ user: req.user.id });
  if (!profile) {
    res.status(404);
    throw new Error('Profile not found');
  }
  res.json(profile);
};

module.exports = {createOrUpdateProfile,getProfile}