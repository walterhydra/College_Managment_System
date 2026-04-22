import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Session from '../models/Session.js';

export const protect = async (req, res, next) => {
  let token;

  token = req.cookies.jwt;

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Verify the session is still valid
      if (decoded.sessionId) {
        const session = await Session.findById(decoded.sessionId);
        if (!session || !session.isValid) {
          return res.status(401).json({ message: 'Session expired or revoked. Please login again.' });
        }
        // Update lastActive
        session.lastActive = new Date();
        await session.save();
      }

      req.user = await User.findById(decoded.userId).select('-password');
      next();
    } catch (error) {
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

// Admin middleware
export const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Not authorized as an admin' });
  }
};

// Staff middleware
export const staff = (req, res, next) => {
  if (req.user && (req.user.role === 'staff' || req.user.role === 'admin')) {
    next();
  } else {
    res.status(403).json({ message: 'Not authorized as staff' });
  }
};
