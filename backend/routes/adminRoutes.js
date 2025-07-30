const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const adminAuth = require('../middleware/adminMiddleware');
const { getAllUsers, deleteUser, getAllMealPlans, getAllWorkoutPlans, getUserStats } = require('../controllers/adminController');

router.use(protect);
router.use(adminAuth);

router.get('/users', getAllUsers);
router.delete('/users/:userId', deleteUser);

router.get('/meal-plans', getAllMealPlans);
router.get('/workout-plans', getAllWorkoutPlans);

router.get('/stats', getUserStats);

module.exports = router; 