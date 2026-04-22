import express from 'express';
import { getTimetable, getCalendar, getSubjects } from '../controllers/academicController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/timetable', protect, getTimetable);
router.get('/calendar', protect, getCalendar);
router.get('/subjects', protect, getSubjects);

export default router;
