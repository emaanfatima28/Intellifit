const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const { createFeedback, getFeedbackById, getFeedbacks, updateFeedback, deleteFeedback } = require('../controllers/feedbackController');

router.post('/', protect, (req, res, next) => {
  req.body.userId = req.user._id;
  next();
}, createFeedback);

router.get('/', protect, getFeedbacks);
router.get('/:id', protect, getFeedbackById);
router.put('/:id', protect, updateFeedback);
router.delete('/:id', protect, deleteFeedback);

module.exports = router;
