import express from 'express';
import { protect, admin } from '../middlewares/authMiddleware.js';
import {
  submitAntiRaggingComplaint,
  generateSmartTimetable,
  broadcastEmergencyAlert,
  orderCanteenMeal,
  bookFacility,
  getActiveNotices,
  getLostAndFound,
  getBloodGroupDirectory,
  getGrievances,
  resolveGrievance
} from '../controllers/operationsController.js';

const router = express.Router();

// Mixed access routes
router.post('/anti-ragging', submitAntiRaggingComplaint); // Can be public realistically
router.get('/notices', protect, getActiveNotices);
router.get('/lost-found', protect, getLostAndFound);
router.get('/blood-group', protect, getBloodGroupDirectory);

// Protected user routes
router.post('/canteen/order', protect, orderCanteenMeal);
router.post('/booking', protect, bookFacility);

// Admin / Super routes
router.post('/smart-timetable', protect, admin, generateSmartTimetable);
router.post('/emergency-alert', protect, admin, broadcastEmergencyAlert);

router.get('/grievances', protect, admin, getGrievances);
router.post('/grievances/:id/resolve', protect, admin, resolveGrievance);

export default router;
