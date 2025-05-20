const express = require('express');
const authController = require('../controllers/auth.controller');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/forgot-password', authController.forgotPassword);
router.post('/refresh-token', authController.refreshToken);

// Protected routes
router.use(protect);
router.get('/me', authController.getMe);
router.put('/update-details', authController.updateDetails);
router.put('/update-password', authController.updatePassword);
router.post('/logout', authController.logout);

module.exports = router;
