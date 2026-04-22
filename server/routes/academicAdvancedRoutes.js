import express from 'express';
import { 
  getExamResults, 
  getPlacements, 
  predictAttendance,
  scheduleMockInterview,
  getAlumniDirectory,
  getScholarships,
  generateCertificate
} from '../controllers/academicAdvancedController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/exams/results', protect, getExamResults);
router.get('/placements', protect, getPlacements);
router.post('/placements/mock-interview', protect, scheduleMockInterview);
router.get('/attendance/predictor', protect, predictAttendance);
router.get('/alumni', protect, getAlumniDirectory);
router.get('/scholarships', protect, getScholarships);
router.post('/certificates/generate', protect, generateCertificate);

export default router;
