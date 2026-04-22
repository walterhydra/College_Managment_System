import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import { createServer } from 'http';
import { Server } from 'socket.io';
import path from 'path';
import db from './config/db.js';

import authRoutes from './routes/authRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import profileRoutes from './routes/profileRoutes.js';
import academicRoutes from './routes/academicRoutes.js';
import facilityRoutes from './routes/facilityRoutes.js';
import academicAdvancedRoutes from './routes/academicAdvancedRoutes.js';
import operationsRoutes from './routes/operationsRoutes.js';
import { auditLogger } from './middlewares/auditLogger.js';
import rateLimit from 'express-rate-limit';

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: { message: 'Too many requests from this IP, please try again after 15 minutes' },
  standardHeaders: true,
  legacyHeaders: false,
});

dotenv.config();

// Connect to DB
db();

const app = express();
const httpServer = createServer(app);

// Initialize Socket.io
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT'],
    credentials: true,
  },
});

app.set('io', io); // make io accessible in routes

io.on('connection', (socket) => {
  console.log(`Socket Connected: ${socket.id}`);
  
  socket.on('join_room', (userId) => {
    socket.join(userId);
    console.log(`User ${userId} joined room`);
  });

  socket.on('send_message', (data) => {
    // data contains { senderId, text, timestamp }
    // Broadcast message back to the sender for their own UI sync
    io.to(data.senderId).emit('receive_message', data);
    
    // Simulate an Admin Auto-Reply
    setTimeout(() => {
      io.to(data.senderId).emit('receive_message', {
        senderId: 'admin',
        text: 'Thank you for reaching out. A faculty member will review your query shortly.',
        timestamp: new Date().toISOString()
      });
    }, 1500);
  });

  socket.on('disconnect', () => {
    console.log(`Socket Disconnected: ${socket.id}`);
  });
});

// Security Middlewares
app.use(helmet({ crossOriginResourcePolicy: false })); // allow images to load locally
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

// Body Parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan('dev'));

// Static Folders
const __dirname = path.resolve();
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

// Routes
app.use('/api', apiLimiter, auditLogger); // Apply rate limiting and custom auditing to all /api routes
app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/academics', academicRoutes);
app.use('/api/facilities', facilityRoutes);
app.use('/api/advanced', academicAdvancedRoutes);
app.use('/api/operations', operationsRoutes);

// Basic Route
app.get('/', (req, res) => {
  res.send('College ERP API is running...');
});

// Error Handler Middleware
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
