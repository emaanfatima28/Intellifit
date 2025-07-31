const Profile = require("../models/Profile");
const createOrUpdateProfile = async (req, res) => {
  try {
    const { age, gender, height, weight, goal, activityLevel } = req.body;
    const userId = req.user.id;

    let profile = await Profile.findOne({ user: userId });

    if (profile) {
      profile.age = age;
      profile.gender = gender;
      profile.height = height;
      profile.weight = weight;
      profile.goal = goal;
      profile.activityLevel = activityLevel;
      await profile.save();
    } else {
      profile = await Profile.create({
        user: userId,
        age,
        gender,
        height,
        weight,
        goal,
        activityLevel,
      });
    }

    res.status(200).json(profile);
  } catch (error) {
    console.error("Profile creation error:", error);
    res.status(500).json({ error: error.message });
  }
};

const getProfile = async (req, res) => {
  const profile = await Profile.findOne({ user: req.user.id });
  if (!profile) {
    res.status(404);
    throw new Error("Profile not found");
  }
  res.json(profile);
};

module.exports = { createOrUpdateProfile, getProfile };
