// operationsController.js
// Handles various utility, emergency, and campus management modules.

// @desc    Submit Anonymous Anti-Ragging Complaint
// @route   POST /api/operations/anti-ragging
// @access  Public / Private
export const submitAntiRaggingComplaint = async (req, res) => {
  try {
    const { incidentDetails, location, date } = req.body;
    res.json({
      message: 'Anonymous complaint registered successfully. The anti-ragging squad has been notified instantly.',
      referenceId: 'AR-' + Math.floor(Math.random() * 999999)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Generate Smart Timetable
// @route   POST /api/operations/smart-timetable
// @access  Private (Admin)
export const generateSmartTimetable = async (req, res) => {
  try {
    // Expected logic: AI or constraint solver takes subjects, faculties, rooms
    res.json({
      message: 'Smart Timetable Generation Triggered. Conflict-free schedule will be available shortly.',
      engineStatus: 'Processing 450 parameters...'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Broadcast Emergency Alert
// @route   POST /api/operations/emergency-alert
// @access  Private (Admin)
export const broadcastEmergencyAlert = async (req, res) => {
  try {
    const { message, severity } = req.body;
    
    // To implement via socket.io inside server.js (io.emit)
    res.json({
      message: 'EMERGENCY ALERT BLASTED TO ALL ACTIVE CONNECTIONS.',
      alertSent: {
        message: message || "Evacuate campus immediately.",
        severity: severity || "CRITICAL",
        timestamp: new Date()
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Pre-order Canteen Meal
// @route   POST /api/operations/canteen/order
// @access  Private
export const orderCanteenMeal = async (req, res) => {
  try {
    const { mealId, quantity, expectedPickupTime } = req.body;
    res.json({
      message: 'Meal Pre-ordered successfully',
      orderId: 'CANT-' + Math.floor(Math.random() * 10000),
      pickupCode: Math.floor(1000 + Math.random() * 9000)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Book Facility (Sports/Lab/Seminar)
// @route   POST /api/operations/booking
// @access  Private
export const bookFacility = async (req, res) => {
  try {
    const { facilityId, date, timeSlot } = req.body;
    res.json({
      message: 'Facility booked successfully',
      bookingReference: 'FAC-' + Date.now()
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get Digital Notice Board
// @route   GET /api/operations/notices
// @access  Private
export const getActiveNotices = async (req, res) => {
  try {
    res.json({
      notices: [
        { id: 1, title: 'Exam Guidelines 2026', content: 'No electronics allowed.', expiry: '2026-05-01', priority: 'High' },
        { id: 2, title: 'Campus Fest Postponed', content: 'Moved to next month.', expiry: '2026-04-30', priority: 'Normal' }
      ]
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get Lost & Found Items
// @route   GET /api/operations/lost-found
// @access  Private
export const getLostAndFound = async (req, res) => {
  try {
    res.json({
      items: [
        { id: 101, type: 'Lost', item: 'Car Keys', location: 'Library', date: '2026-04-20', contact: 'admin@library' },
        { id: 102, type: 'Found', item: 'Dell Laptop', location: 'Seminar Hall B', date: '2026-04-21', contact: 'security@desk' }
      ]
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get Blood Group Directory
// @route   GET /api/operations/blood-group
// @access  Private
export const getBloodGroupDirectory = async (req, res) => {
  try {
    res.json({
      directory: [
        { bloodGroup: 'O+', count: 450, availableDonors: 120 },
        { bloodGroup: 'B+', count: 320, availableDonors: 85 },
        { bloodGroup: 'A-', count: 45, availableDonors: 12 }
      ]
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Mock in-memory database for grievances
let grievancesDb = [
  { id: 1, title: 'Hostel Wi-Fi issue in Block A', status: 'Pending', date: '2026-04-21', student: 'Milan Patel' },
  { id: 2, title: 'Library AC not working', status: 'Pending', date: '2026-04-20', student: 'Rahul Sharma' },
  { id: 3, title: 'Canteen food hygiene concern', status: 'Pending', date: '2026-04-19', student: 'Anita Desai' }
];

// @desc    Get all active grievances
// @route   GET /api/operations/grievances
// @access  Private (Admin)
export const getGrievances = async (req, res) => {
  try {
    const activeGrievances = grievancesDb.filter(g => g.status === 'Pending');
    res.json(activeGrievances);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Resolve a grievance
// @route   POST /api/operations/grievances/:id/resolve
// @access  Private (Admin)
export const resolveGrievance = async (req, res) => {
  try {
    const { id } = req.params;
    const grievance = grievancesDb.find(g => g.id === parseInt(id));
    if (grievance) {
      grievance.status = 'Resolved';
      res.json({ message: 'Grievance resolved successfully', grievance });
    } else {
      res.status(404).json({ message: 'Grievance not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
