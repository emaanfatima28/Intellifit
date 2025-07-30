const Progress = require('../models/Progress');

const createProgress = async (req, res) => {
  try {
    const progress = new Progress(req.body);
    await progress.save();
    res.status(201).json(progress);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getProgresses = async (req, res) => {
  try {
    const filter = {};
    if (req.query.userId) filter.userId = req.query.userId;
    if (req.query.date) filter.date = req.query.date;
    const progresses = await Progress.find(filter);
    res.json(progresses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getProgressById = async (req, res) => {
  try {
    const progress = await Progress.findById(req.params.id);
    if (!progress) return res.status(404).json({ error: 'Progress not found' });
    res.json(progress);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateProgress = async (req, res) => {
  try {
    const progress = await Progress.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!progress) return res.status(404).json({ error: 'Progress not found' });
    res.json(progress);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteProgress = async (req, res) => {
  try {
    const progress = await Progress.findByIdAndDelete(req.params.id);
    if (!progress) return res.status(404).json({ error: 'Progress not found' });
    res.json({ message: 'Progress deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {createProgress,getProgressById,getProgresses,updateProgress,deleteProgress};