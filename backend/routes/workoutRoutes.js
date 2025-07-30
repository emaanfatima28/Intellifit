const express = require('express');
const router = express.Router();
const { createWorkoutPlan, getCurrentWorkoutPlan, updateWorkoutPlan } = require('../controllers/workoutController');
const protect = require('../middleware/authMiddleware'); 

router.post('/', protect, createWorkoutPlan);
router.get('/current', protect, getCurrentWorkoutPlan);
router.put('/update', protect, updateWorkoutPlan);

module.exports = router;
