const express = require('express');
const aiController = require('../controllers/ai.controller');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Public routes (for demo purposes)
router.post('/message', aiController.processMessage);
router.post('/newsletter', aiController.subscribeNewsletter);
router.post('/contact', aiController.submitContactForm);

// Protected routes (require authentication)
router.use(protect);

// Conversation routes
router.post('/conversations', aiController.createConversation);
router.get('/conversations', aiController.getConversations);
router.get('/conversations/:id', aiController.getConversation);
router.delete('/conversations/:id', aiController.deleteConversation);

// Message routes
router.post('/conversations/:id/messages', aiController.addMessage);

// Module-specific routes
router.post('/modules/:moduleId/analyze', aiController.analyzeWithModule);

module.exports = router;
