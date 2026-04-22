// @desc    Get fee details and history
// @route   GET /api/facilities/fees
// @access  Private
export const getFees = async (req, res) => {
  try {
    const feeData = {
      summary: {
        totalFees: 120000,
        paidFees: 60000,
        dueFees: 60000,
        dueDate: '2023-11-30'
      },
      history: [
        {
          id: 'TXN10293847',
          date: '2023-08-15',
          amount: 60000,
          semester: 'Odd Semester 2023',
          mode: 'Razorpay',
          status: 'SUCCESS'
        }
      ],
      breakdown: [
        { item: 'Tuition Fee', amount: 90000 },
        { item: 'Development Fee', amount: 15000 },
        { item: 'Exam Fee', amount: 5000 },
        { item: 'Library Fee', amount: 5000 },
        { item: 'Activity Fee', amount: 5000 }
      ]
    };
    res.json(feeData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Process a mock fee payment
// @route   POST /api/facilities/fees/pay
// @access  Private
export const processPayment = async (req, res) => {
  try {
    const { amount } = req.body;
    
    // In a real app we'd verify Razorpay signature here
    // Here we just return success
    
    res.json({ 
      success: true, 
      message: 'Payment processed successfully',
      transactionId: `TXN${Math.floor(Math.random() * 100000000)}`,
      amount,
      date: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get hostel details
// @route   GET /api/facilities/hostel
// @access  Private
export const getHostelDetails = async (req, res) => {
  try {
    const hostelData = {
      roomDetails: {
        hostelName: 'Boys Hostel A',
        roomNumber: 'B-214',
        bedType: 'Standard Non-AC',
        occupancy: 3,
        warden: 'Mr. R.K. Singh',
        wardenPhone: '+91 9876543210'
      },
      messMenu: {
        Monday: { breakfast: 'Poha, Tea', lunch: 'Roti, Dal, Rice, Mix Veg', dinner: 'Roti, Paneer Butter Masala, Rice' },
        Tuesday: { breakfast: 'Idli Sambar, Coffee', lunch: 'Puri, Chole, Rice, Curd', dinner: 'Roti, Kadhai Paneer, Dal Makhani' },
        Wednesday: { breakfast: 'Aloo Paratha, Curd', lunch: 'Roti, Rajma, Rice', dinner: 'Roti, Mix Veg, Dal Fry, Gulab Jamun' },
        Thursday: { breakfast: 'Upma, Tea', lunch: 'Roti, Dal, Rice, Bhindi', dinner: 'Roti, Egg Curry / Malai Kofta, Rice' },
        Friday: { breakfast: 'Dosa, Sambar', lunch: 'Roti, Kadhi Pakora, Jeera Rice', dinner: 'Roti, Dal Tadka, Aloo Gobi' },
        Saturday: { breakfast: 'Puri Bhaji, Tea', lunch: 'Veg Biryani, Raita', dinner: 'Roti, Dal, Mix Veg' },
        Sunday: { breakfast: 'Chole Bhature', lunch: 'Special Thali', dinner: 'Pav Bhaji, Pulao' }
      }
    };
    res.json(hostelData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get transport details
// @route   GET /api/facilities/transport
// @access  Private
export const getTransportDetails = async (req, res) => {
  try {
    const transportData = {
      userRoute: {
        status: 'Active',
        routeName: 'Route 4 - City Center',
        pickupPoint: 'Main Square Clock Tower',
        pickupTime: '07:45 AM',
        dropTime: '05:15 PM',
        busNumber: 'GJ-06-XX-1234',
        driverName: 'Ramesh Bhai',
        driverPhone: '+91 9123456780'
      },
      availableRoutes: [
        { id: 1, name: 'Route 1 - North Zone', availableSeats: 5 },
        { id: 2, name: 'Route 2 - South Zone', availableSeats: 12 },
        { id: 3, name: 'Route 3 - East Zone', availableSeats: 0 },
        { id: 4, name: 'Route 4 - City Center', availableSeats: 8 }
      ]
    };
    res.json(transportData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
