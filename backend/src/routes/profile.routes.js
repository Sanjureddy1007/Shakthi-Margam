const express = require('express');
const profileController = require('../controllers/profile.controller');
const { protect } = require('../middleware/auth');

const router = express.Router();

// All profile routes require authentication
router.use(protect);

// Business profile routes
router.post('/', profileController.createBusinessProfile);
router.get('/', profileController.getBusinessProfiles);
router.get('/:id', profileController.getBusinessProfile);
router.put('/:id', profileController.updateBusinessProfile);
router.delete('/:id', profileController.deleteBusinessProfile);

// Business profile assessment routes
router.post('/:id/assessment', profileController.submitAssessment);
router.get('/:id/assessment', profileController.getAssessment);
router.put('/:id/assessment', profileController.updateAssessment);

// Business profile analytics routes
router.get('/:id/analytics', profileController.getBusinessAnalytics);
router.get('/:id/recommendations', profileController.getRecommendations);

module.exports = router;
