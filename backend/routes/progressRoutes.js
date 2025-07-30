const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const { createProgress, getProgressById, getProgresses, updateProgress, deleteProgress } = require('../controllers/progressController');

router.post('/', protect, (req, res, next) => {
  req.body.userId = req.user._id;
  next();
}, createProgress);

router.get('/', protect, getProgresses);
router.get('/:id', protect, getProgressById);
router.put('/:id', protect, updateProgress);
router.delete('/:id', protect, deleteProgress);

module.exports = router;
