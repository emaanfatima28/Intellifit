const express = require('express');
const router = express.Router();
const { createMealPlan, getCurrentMealPlan, updateMealPlan } = require('../controllers/mealController');
const protect = require('../middleware/authMiddleware');

router.post('/', protect, createMealPlan);
router.get('/current', protect, getCurrentMealPlan);
router.put('/update', protect, updateMealPlan);

module.exports = router;
