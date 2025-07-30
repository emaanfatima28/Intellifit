const express = require("express");
const router = express.Router();
const { registerUser, userLogin, forgotPassword, resetPassword } = require("../controllers/userConroller");

router.post('/auth/register', registerUser);
router.post('/auth/login', userLogin);
router.post('/forgot-password', forgotPassword);
router.put('/reset-password/:token', resetPassword);

module.exports = router;