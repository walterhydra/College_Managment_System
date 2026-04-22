import User from '../models/User.js';
import Profile from '../models/Profile.js';
import Session from '../models/Session.js';
import ActivityLog from '../models/ActivityLog.js';
import jwt from 'jsonwebtoken';
import speakeasy from 'speakeasy';
import qrcode from 'qrcode';

// Generate JWT
const generateToken = (res, userId, sessionId, extendExpiry = false) => {
  const expiresIn = extendExpiry ? '30d' : '1d';
  const token = jwt.sign({ userId, sessionId }, process.env.JWT_SECRET, {
    expiresIn,
  });

  res.cookie('jwt', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== 'development',
    sameSite: 'strict',
    maxAge: extendExpiry ? 30 * 24 * 60 * 60 * 1000 : 1 * 24 * 60 * 60 * 1000,
  });
};

// @desc    Auth user & get token (or trigger 2FA)
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).populate('profile');

    if (user && (await user.matchPassword(password))) {
      if (!user.isActive) {
        return res.status(401).json({ message: 'Account is deactivated' });
      }

      if (user.twoFactorEnabled) {
        // Just return a partial response indicating 2FA is needed
        return res.json({
          requires2FA: true,
          userId: user._id,
          message: 'Please enter your 2FA code',
        });
      }

      // Create session array
      const session = await Session.create({
        user: user._id,
        userAgent: req.headers['user-agent'] || 'Unknown Device',
        ipAddress: req.ip || 'Unknown IP',
      });

      // Log activity
      await ActivityLog.create({
        user: user._id,
        action: 'LOGIN',
        description: 'User logged in via primary route',
        ipAddress: req.ip || 'Unknown IP',
        userAgent: req.headers['user-agent'] || 'Unknown Device',
      });

      generateToken(res, user._id, session._id);

      res.json({
        _id: user._id,
        email: user.email,
        role: user.role,
        profile: user.profile,
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Verify 2FA token
// @route   POST /api/auth/verify-2fa
// @access  Public
export const verify2FA = async (req, res) => {
  try {
    const { userId, token } = req.body;

    const user = await User.findById(userId).populate('profile');
    if (!user) return res.status(404).json({ message: 'User not found' });

    const verified = speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: 'base32',
      token,
    });

    if (verified) {
      const session = await Session.create({
        user: user._id,
        userAgent: req.headers['user-agent'] || 'Unknown Device',
        ipAddress: req.ip || 'Unknown IP',
      });

      await ActivityLog.create({
        user: user._id,
        action: 'LOGIN_2FA',
        description: 'User logged in via 2FA successfully',
        ipAddress: req.ip || 'Unknown IP',
        userAgent: req.headers['user-agent'] || 'Unknown Device',
      });

      generateToken(res, user._id, session._id);
      res.json({
        _id: user._id,
        email: user.email,
        role: user.role,
        profile: user.profile,
      });
    } else {
      res.status(400).json({ message: 'Invalid OTP' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Logout user / clear cookie
// @route   POST /api/auth/logout
// @access  Public
export const logoutUser = (req, res) => {
  res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: 'Logged out successfully' });
};

// @desc    Get user profile
// @route   GET /api/auth/me
// @access  Private
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('profile');
    if (user) {
      res.json({
        _id: user._id,
        email: user.email,
        role: user.role,
        profile: user.profile,
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Enable 2FA (Generates Secret and QR Code)
// @route   POST /api/auth/enable-2fa
// @access  Private
export const generate2FASecret = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    if (user.twoFactorEnabled) {
      return res.status(400).json({ message: '2FA is already enabled' });
    }

    const secret = speakeasy.generateSecret({ name: `ERP System (${user.email})` });
    user.twoFactorSecret = secret.base32;
    await user.save();

    qrcode.toDataURL(secret.otpauth_url, (err, data_url) => {
      if (err) return res.status(500).json({ message: 'Error generating QR code' });
      res.json({ secret: secret.base32, qrCode: data_url });
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Confirm 2FA enablement
// @route   POST /api/auth/confirm-2fa
// @access  Private
export const confirm2FA = async (req, res) => {
  try {
    const { token } = req.body;
    const user = await User.findById(req.user._id);

    const verified = speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: 'base32',
      token,
    });

    if (verified) {
      user.twoFactorEnabled = true;
      await user.save();
      res.json({ message: '2FA enabled successfully' });
    } else {
      res.status(400).json({ message: 'Invalid token' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user sessions
// @route   GET /api/auth/sessions
// @access  Private
export const getUserSessions = async (req, res) => {
  try {
    const sessions = await Session.find({ user: req.user._id, isValid: true }).sort('-createdAt');
    res.json(sessions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Revoke session
// @route   DELETE /api/auth/sessions/:id
// @access  Private
export const revokeSession = async (req, res) => {
  try {
    const session = await Session.findOne({ _id: req.params.id, user: req.user._id });
    if (session) {
      session.isValid = false;
      await session.save();

      await ActivityLog.create({
        user: req.user._id,
        action: 'REVOKE_SESSION',
        description: `Revoked session from device: ${session.userAgent}`,
        ipAddress: req.ip || 'Unknown IP',
        userAgent: req.headers['user-agent'] || 'Unknown Device',
      });

      res.json({ message: 'Session revoked successfully' });
    } else {
      res.status(404).json({ message: 'Session not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user activity log
// @route   GET /api/auth/activity
// @access  Private
export const getUserActivityLog = async (req, res) => {
  try {
    const logs = await ActivityLog.find({ user: req.user._id }).sort('-createdAt').limit(20);
    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
