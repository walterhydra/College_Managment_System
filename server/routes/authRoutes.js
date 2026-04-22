import express from 'express';
import {
  loginUser,
  logoutUser,
  getUserProfile,
  verify2FA,
  generate2FASecret,
  confirm2FA,
  getUserSessions,
  revokeSession,
  getUserActivityLog
} from '../controllers/authController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/login', loginUser);
router.post('/verify-2fa', verify2FA);
router.post('/logout', logoutUser);

// Protected routes
router.get('/me', protect, getUserProfile);
router.post('/enable-2fa', protect, generate2FASecret);
router.post('/confirm-2fa', protect, confirm2FA);

// Session & Activity routes
router.get('/sessions', protect, getUserSessions);
router.delete('/sessions/:id', protect, revokeSession);
router.get('/activity', protect, getUserActivityLog);

export default router;
