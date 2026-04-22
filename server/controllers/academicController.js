// @desc    Get weekly timetable
// @route   GET /api/academics/timetable
// @access  Private
export const getTimetable = async (req, res) => {
  try {
    const timetable = {
      Monday: [
        { time: '09:00 AM - 10:00 AM', subject: 'Data Structures', room: 'Lab 1', type: 'Lab', instructor: 'Prof. Sharma' },
        { time: '10:15 AM - 11:15 AM', subject: 'Operating Systems', room: 'Room 304', type: 'Lecture', instructor: 'Dr. Patel' }
      ],
      Tuesday: [
        { time: '09:00 AM - 10:00 AM', subject: 'Database Management', room: 'Room 201', type: 'Lecture', instructor: 'Prof. Verma' },
        { time: '11:30 AM - 12:30 PM', subject: 'Computer Networks', room: 'Room 305', type: 'Lecture', instructor: 'Dr. Singh' }
      ],
      Wednesday: [
        { time: '10:15 AM - 12:15 PM', subject: 'Web Technologies', room: 'Lab 3', type: 'Lab', instructor: 'Prof. Kumar' }
      ],
      Thursday: [
        { time: '09:00 AM - 10:00 AM', subject: 'Data Structures', room: 'Room 301', type: 'Lecture', instructor: 'Prof. Sharma' },
        { time: '10:15 AM - 11:15 AM', subject: 'Operating Systems', room: 'Room 304', type: 'Lecture', instructor: 'Dr. Patel' }
      ],
      Friday: [
        { time: '09:00 AM - 11:00 AM', subject: 'Database Management', room: 'Lab 2', type: 'Lab', instructor: 'Prof. Verma' },
        { time: '11:30 AM - 12:30 PM', subject: 'Soft Skills', room: 'Seminar Hall', type: 'Lecture', instructor: 'Mrs. Desai' }
      ],
      Saturday: [],
      Sunday: []
    };
    
    res.json(timetable);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get academic calendar
// @route   GET /api/academics/calendar
// @access  Private
export const getCalendar = async (req, res) => {
  try {
    const calendar = [
      { date: '2023-08-01', title: 'Odd Semester Starts', type: 'academic' },
      { date: '2023-08-15', title: 'Independence Day', type: 'holiday' },
      { date: '2023-09-05', title: 'Teachers Day Celebration', type: 'event' },
      { date: '2023-10-15', title: 'Mid-term Examinations Begin', type: 'exam' },
      { date: '2023-10-24', title: 'Dussehra', type: 'holiday' },
      { date: '2023-11-10', title: 'Diwali Vacation Starts', type: 'holiday' },
      { date: '2023-12-05', title: 'End-term Practical Exams', type: 'exam' },
      { date: '2023-12-15', title: 'End-term Theory Exams', type: 'exam' },
      { date: '2023-12-25', title: 'Christmas', type: 'holiday' }
    ];
    res.json(calendar);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get subjects and attendance
// @route   GET /api/academics/subjects
// @access  Private
export const getSubjects = async (req, res) => {
  try {
    const subjects = [
      { 
        id: 'CS301', 
        name: 'Data Structures', 
        credits: 4, 
        attendanceTotal: 40, 
        attendancePresent: 36,
        materials: 12
      },
      { 
        id: 'CS302', 
        name: 'Operating Systems', 
        credits: 3, 
        attendanceTotal: 30, 
        attendancePresent: 24,
        materials: 8
      },
      { 
        id: 'CS303', 
        name: 'Database Management', 
        credits: 4, 
        attendanceTotal: 40, 
        attendancePresent: 38,
        materials: 15
      },
      { 
        id: 'CS304', 
        name: 'Computer Networks', 
        credits: 3, 
        attendanceTotal: 30, 
        attendancePresent: 20,
        materials: 5
      },
      { 
        id: 'CS305', 
        name: 'Web Technologies', 
        credits: 2, 
        attendanceTotal: 20, 
        attendancePresent: 19,
        materials: 22
      }
    ];
    res.json(subjects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
