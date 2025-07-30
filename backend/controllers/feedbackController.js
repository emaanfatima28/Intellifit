const Feedback = require('../models/Feedback');
const MealPlan = require('../models/Meal');
const WorkoutPlan = require('../models/Workout');

const createFeedback = async (req, res) => {
  try {
    const feedback = new Feedback(req.body);
    await feedback.save();

    const { planType, planId } = req.body;
    if (planType === 'meal') {
      await MealPlan.findByIdAndUpdate(planId, { feedbackGiven: true });
    } else if (planType === 'workout') {
      await WorkoutPlan.findByIdAndUpdate(planId, { feedbackGiven: true });
    }

    res.status(201).json(feedback);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getFeedbacks = async (req, res) => {
  try {
    const filter = {};
    if (req.query.userId) filter.userId = req.query.userId;
    if (req.query.planType) filter.planType = req.query.planType;
    if (req.query.planId) filter.planId = req.query.planId;
    const feedbacks = await Feedback.find(filter);
    res.json(feedbacks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getFeedbackById = async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id);
    if (!feedback) return res.status(404).json({ error: 'Feedback not found' });
    res.json(feedback);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!feedback) return res.status(404).json({ error: 'Feedback not found' });
    res.json(feedback);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.findByIdAndDelete(req.params.id);
    if (!feedback) return res.status(404).json({ error: 'Feedback not found' });
    res.json({ message: 'Feedback deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {createFeedback,getFeedbackById,getFeedbacks,updateFeedback,deleteFeedback};