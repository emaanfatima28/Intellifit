const express = require('express');
const router = express.Router();
const { createOrUpdateProfile , getProfile, deleteProfile } = require('../controllers/profileController');
const protect = require('../middleware/authMiddleware');

router.post('/', protect, createOrUpdateProfile);
router.get('/', protect, getProfile);
router.delete('/:userId', protect, deleteProfile);

module.exports = router;
