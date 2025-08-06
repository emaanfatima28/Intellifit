const express = require('express');
const router = express.Router();
const { createMealPlan, getCurrentMealPlan, updateMealPlan, generateWeeklyMealPlan } = require('../controllers/mealController');
const protect = require('../middleware/authMiddleware');

router.post('/', protect, createMealPlan);
router.post('/weekly', protect, generateWeeklyMealPlan);
router.get('/current', protect, getCurrentMealPlan);
router.put('/update', protect, updateMealPlan);

module.exports = router;
