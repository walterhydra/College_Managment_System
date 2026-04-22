import express from 'express';
import { protect, admin, staff } from '../middlewares/authMiddleware.js';
import { exportUsersCSV, searchUsers, getActivityLogs, getAttendanceUsers, checkAttendanceStatus, submitAttendance } from '../controllers/adminController.js';

const router = express.Router();

router.get('/export-users', protect, staff, exportUsersCSV);
router.get('/users/search', protect, staff, searchUsers);
router.get('/activity-logs', protect, admin, getActivityLogs);

// Attendance routes
router.get('/attendance/users', protect, staff, getAttendanceUsers);
router.get('/attendance/check', protect, staff, checkAttendanceStatus);
router.post('/attendance/submit', protect, staff, submitAttendance);

export default router;
