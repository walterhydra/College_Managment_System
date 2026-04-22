import express from 'express';
import { protect, admin } from '../middlewares/authMiddleware.js';
import {
  applyForInternship,
  getInternships,
  generateInternshipCertificate,
  getAIAnalytics,
  chatBotQuery,
  triggerSMSAlert
} from '../controllers/advancedIntegrationsController.js';

const router = express.Router();

// Internship Routes
router.post('/internships/apply', protect, applyForInternship);
router.get('/internships', protect, getInternships);
router.post('/internships/certificate', protect, generateInternshipCertificate);

// AI / Gemini Analytics Routes
router.get('/analytics/performance', protect, getAIAnalytics);
router.post('/chatbot', protect, chatBotQuery);

// SMS / Twilio Trigger (Admin only)
router.post('/alerts/sms', protect, admin, triggerSMSAlert);

export default router;
