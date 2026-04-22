import User from '../models/User.js';
import Profile from '../models/Profile.js';
import ActivityLog from '../models/ActivityLog.js';
import Attendance from '../models/Attendance.js';
import { parse } from 'json2csv';

// @desc    Export all users to CSV
// @route   GET /api/admin/export-users
// @access  Private (Admin)
export const exportUsersCSV = async (req, res) => {
  try {
    const users = await User.find({}).populate('profile').lean();
    
    const fields = ['_id', 'email', 'role', 'isActive', 'createdAt', 'firstName', 'lastName', 'enrollmentNo', 'department'];
    const data = users.map(user => ({
      _id: user._id.toString(),
      email: user.email,
      role: user.role,
      isActive: user.isActive,
      createdAt: user.createdAt,
      firstName: user.profile?.firstName || '',
      lastName: user.profile?.lastName || '',
      enrollmentNo: user.profile?.enrollmentNo || '',
      department: user.profile?.department || ''
    }));

    const csv = parse(data, { fields });
    res.header('Content-Type', 'text/csv');
    res.attachment('database_backup.csv');
    return res.send(csv);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Search students in directory
// @route   GET /api/admin/users/search
// @access  Private (Admin)
export const searchUsers = async (req, res) => {
  try {
    const { q } = req.query;
    let allUsers = [];

    if (!q) {
      allUsers = await User.find({ role: 'student' }).populate('profile');
    } else {
      // Search by email in User
      const usersByEmail = await User.find({ email: { $regex: q, $options: 'i' }, role: 'student' }).populate('profile');
      
      // Search by name/enrollment in Profile
      const profiles = await Profile.find({
        $or: [
          { firstName: { $regex: q, $options: 'i' } },
          { lastName: { $regex: q, $options: 'i' } },
          { enrollmentNo: { $regex: q, $options: 'i' } }
        ]
      });
      const profileUserIds = profiles.map(p => p.user);
      const usersByProfile = await User.find({ _id: { $in: profileUserIds }, role: 'student' }).populate('profile');

      // Merge and deduplicate
      const mergedUsers = [...usersByEmail, ...usersByProfile];
      allUsers = Array.from(new Set(mergedUsers.map(a => a._id.toString())))
        .map(id => mergedUsers.find(a => a._id.toString() === id));
    }

    res.json(allUsers.map(u => ({
      _id: u._id,
      email: u.email,
      firstName: u.profile?.firstName,
      lastName: u.profile?.lastName,
      enrollmentNo: u.profile?.enrollmentNo,
      department: u.profile?.department,
      status: u.isActive ? 'Active' : 'Inactive'
    })));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get activity logs (System Alerts)
// @route   GET /api/admin/activity-logs
// @access  Private (Admin)
export const getActivityLogs = async (req, res) => {
  try {
    const logs = await ActivityLog.find({}).sort({ createdAt: -1 }).limit(10).populate('user', 'email role');
    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all users for attendance
// @route   GET /api/admin/attendance/users
// @access  Private (Staff)
export const getAttendanceUsers = async (req, res) => {
  try {
    const users = await User.find({ role: { $in: ['student', 'staff'] } }).populate('profile');
    
    const students = [];
    const staff = [];

    users.forEach(u => {
      const formatted = {
        _id: u._id,
        email: u.email,
        firstName: u.profile?.firstName,
        lastName: u.profile?.lastName,
        enrollmentNo: u.profile?.enrollmentNo,
        department: u.profile?.department,
        status: u.isActive ? 'Active' : 'Inactive'
      };
      if (u.role === 'student') students.push(formatted);
      if (u.role === 'staff') staff.push(formatted);
    });

    res.json({ students, staff });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Check attendance status for a given date
// @route   GET /api/admin/attendance/check
// @access  Private (Staff)
export const checkAttendanceStatus = async (req, res) => {
  try {
    const { date } = req.query;
    if (!date) return res.status(400).json({ message: 'Date is required' });

    const targetDate = new Date(date);
    if (isNaN(targetDate)) return res.status(400).json({ message: 'Invalid date format' });

    targetDate.setUTCHours(0, 0, 0, 0);

    const attendance = await Attendance.findOne({ date: targetDate }).populate({
      path: 'records.user',
      populate: { path: 'profile' }
    });

    if (attendance) {
      const records = attendance.records.map(record => ({
        user: {
          _id: record.user._id,
          firstName: record.user.profile?.firstName,
          lastName: record.user.profile?.lastName,
          enrollmentNo: record.user.profile?.enrollmentNo,
          department: record.user.profile?.department,
        },
        role: record.role,
        status: record.status
      }));
      return res.json({ exists: true, records, submittedAt: attendance.submittedAt });
    }

    res.json({ exists: false, records: [] });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Submit daily attendance
// @route   POST /api/admin/attendance/submit
// @access  Private (Staff)
export const submitAttendance = async (req, res) => {
  try {
    const { date, records } = req.body;
    
    if (!date) return res.status(400).json({ message: 'Date is required' });
    if (!records || records.length === 0) return res.status(400).json({ message: 'Records cannot be empty' });

    const submitDate = new Date(date);
    if (isNaN(submitDate)) return res.status(400).json({ message: 'Invalid date format' });

    // Validate future date
    const today = new Date();
    today.setUTCHours(23, 59, 59, 999);
    if (submitDate > today) return res.status(400).json({ message: 'Cannot submit attendance for a future date' });

    submitDate.setUTCHours(0, 0, 0, 0);

    // Duplicate check
    const existing = await Attendance.findOne({ date: submitDate });
    if (existing) return res.status(409).json({ message: 'Attendance already submitted for this date' });

    const attendance = new Attendance({
      date: submitDate,
      markedBy: req.user._id, // Set by auth middleware protect
      records
    });

    await attendance.save();

    res.status(201).json({ message: 'Attendance submitted successfully' });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: 'Attendance already submitted for this date' });
    }
    res.status(500).json({ message: error.message });
  }
};
