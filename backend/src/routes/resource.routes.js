const express = require('express');
const resourceController = require('../controllers/resource.controller');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Public resource routes
router.get('/public', resourceController.getPublicResources);
router.get('/public/:category', resourceController.getPublicResourcesByCategory);
router.get('/public/search', resourceController.searchPublicResources);

// WE-HUB integration routes
router.get('/wehub', resourceController.getWEHubResources);
router.get('/wehub/:category', resourceController.getWEHubResourcesByCategory);

// Government schemes routes
router.get('/government-schemes', resourceController.getGovernmentSchemes);
router.get('/government-schemes/:id', resourceController.getGovernmentSchemeDetails);

// Protected resource routes
router.use(protect);

// User-specific resource routes
router.get('/', resourceController.getUserResources);
router.get('/recommended', resourceController.getRecommendedResources);
router.post('/save/:id', resourceController.saveResource);
router.delete('/save/:id', resourceController.unsaveResource);
router.get('/saved', resourceController.getSavedResources);

// Business templates routes
router.get('/templates', resourceController.getBusinessTemplates);
router.get('/templates/:id', resourceController.getBusinessTemplateDetails);

// Market insights routes
router.get('/market-insights', resourceController.getMarketInsights);
router.get('/market-insights/:category', resourceController.getMarketInsightsByCategory);

module.exports = router;
