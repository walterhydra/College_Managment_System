import express from 'express';
import { getFees, processPayment, getHostelDetails, getTransportDetails } from '../controllers/facilityController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/fees', protect, getFees);
router.post('/fees/pay', protect, processPayment);
router.get('/hostel', protect, getHostelDetails);
router.get('/transport', protect, getTransportDetails);

export default router;
