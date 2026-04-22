import User from '../models/User.js';
import Profile from '../models/Profile.js';

// @desc    Get dashboard stats
// @route   GET /api/dashboard
// @access  Private
export const getDashboardStats = async (req, res) => {
  try {
    // We can simulate stats here, or fetch real data if related models existed (e.g., Attendance, Fee models)
    if (req.user.role === 'student') {
      const stats = {
        cgpa: 8.4,
        attendance: 85,
        pendingFees: 12000,
        activeBacklogs: 0,
        upcomingClasses: [
          { subject: 'Data Structures', time: '10:00 AM', room: 'Lab 1' },
          { subject: 'Operating Systems', time: '11:15 AM', room: 'Room 304' }
        ],
        recentAnnouncements: [
          { title: 'Mid-term exams schedule released', date: '2023-10-15' },
          { title: 'Diwali Vacation notice', date: '2023-10-20' }
        ]
      };
      return res.json(stats);
    } else if (req.user.role === 'admin') {
      const totalStudents = await User.countDocuments({ role: 'student' });
      const stats = {
        totalStudents,
        totalStaff: await User.countDocuments({ role: 'staff' }),
        feeCollection: '₹45,00,000',
        activeComplaints: 12,
      };
      return res.json(stats);
    } else {
      // Staff stats
      const stats = {
        classesToday: 3,
        assignmentsToGrade: 45,
        upcomingMeetings: 2,
      };
      return res.json(stats);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
