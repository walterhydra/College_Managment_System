import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { BookOpen, GraduationCap, Calendar as CalendarIcon, Clock, AlertTriangle, CreditCard, FileText } from 'lucide-react';

const ParentDashboard = () => {
  const { t } = useTranslation();

  // Mock parent/student data
  const [studentInfo, setStudentInfo] = useState({
    name: 'Aarav Patel',
    enrollmentNo: '190410101010',
    course: 'B.Tech Computer Science',
    semester: 6,
    attendance: 82,
    feesDue: 45000,
    nextExam: '15th May 2026',
    recentResult: '8.4 CGPA'
  });

  return (
    <div className="space-y-6 animate-fade-in pb-20">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-navy dark:text-white">Parent Portal</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Monitoring details for <b>{studentInfo.name}</b> ({studentInfo.enrollmentNo})
        </p>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Attendance Widget */}
        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-teal/10 text-teal rounded-lg">
              <Clock size={20} />
            </div>
            <h3 className="font-semibold text-slate-700 dark:text-slate-200">Current Attendance</h3>
          </div>
          <div className="mt-4 flex items-end justify-between">
            <div>
              <p className="text-3xl font-bold text-navy dark:text-white">{studentInfo.attendance}%</p>
              <p className="text-sm text-slate-500 mt-1">Overall Semester</p>
            </div>
            <div className={`text-sm font-medium ${studentInfo.attendance > 75 ? 'text-green-500' : 'text-red-500'}`}>
              {studentInfo.attendance > 75 ? 'Safe Status' : 'Shortage Alert'}
            </div>
          </div>
        </div>

        {/* Fees Widget */}
        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-parulRed/10 text-parulRed rounded-lg">
              <CreditCard size={20} />
            </div>
            <h3 className="font-semibold text-slate-700 dark:text-slate-200">Fees Status</h3>
          </div>
          <div className="mt-4">
            <p className="text-3xl font-bold text-navy dark:text-white">₹{studentInfo.feesDue.toLocaleString()}</p>
            <p className="text-sm text-red-500 font-medium mt-1 inline-flex items-center gap-1">
              <AlertTriangle size={14} /> Due in 12 days
            </p>
          </div>
        </div>

        {/* Academics Widget */}
        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-purple-500/10 text-purple-600 rounded-lg">
              <GraduationCap size={20} />
            </div>
            <h3 className="font-semibold text-slate-700 dark:text-slate-200">Latest Results</h3>
          </div>
          <div className="mt-4">
            <p className="text-3xl font-bold text-navy dark:text-white">{studentInfo.recentResult}</p>
            <p className="text-sm text-slate-500 mt-1">Semester 5 Examination</p>
          </div>
        </div>

        {/* Exams Widget */}
        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-yellow-500/10 text-yellow-600 rounded-lg">
              <CalendarIcon size={20} />
            </div>
            <h3 className="font-semibold text-slate-700 dark:text-slate-200">Upcoming Exams</h3>
          </div>
          <div className="mt-4">
            <p className="text-xl font-bold text-navy dark:text-white">{studentInfo.nextExam}</p>
            <p className="text-sm text-slate-500 mt-1">Mid-term Schedule</p>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* Recent Notifications */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
            <h3 className="font-semibold text-slate-800 dark:text-slate-200">Recent College Notices</h3>
            <button className="text-sm text-teal font-medium hover:underline">View All</button>
          </div>
          <div className="divide-y divide-slate-100 dark:divide-slate-700">
            <div className="p-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
              <h4 className="font-medium text-slate-800 dark:text-slate-200">Fee Payment Reminder</h4>
              <p className="text-sm text-slate-500 mt-1">Last date to pay semester 6 tuition fees is coming up.</p>
              <span className="text-xs text-slate-400 mt-2 block">Today, 10:30 AM</span>
            </div>
            <div className="p-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
              <h4 className="font-medium text-slate-800 dark:text-slate-200">Cultural Fest Registration</h4>
              <p className="text-sm text-slate-500 mt-1">Encourage your ward to participate in Dhoom 2026.</p>
              <span className="text-xs text-slate-400 mt-2 block">Yesterday, 02:15 PM</span>
            </div>
          </div>
        </div>

        {/* Detailed Reports Quick Links */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50">
            <h3 className="font-semibold text-slate-800 dark:text-slate-200">Downloadable Reports</h3>
          </div>
          <div className="p-4 space-y-4">
            <button className="w-full flex items-center justify-between p-4 rounded-lg bg-teal/5 border border-teal/10 hover:bg-teal/10 transition-colors group">
              <div className="flex items-center gap-3">
                <FileText className="text-teal" size={24} />
                <div className="text-left">
                  <h4 className="font-semibold text-slate-800 dark:text-slate-200 group-hover:text-teal transition-colors">Complete Attendance Record</h4>
                  <p className="text-xs text-slate-500">PDF Report spanning current semester</p>
                </div>
              </div>
            </button>
            
            <button className="w-full flex items-center justify-between p-4 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800/30 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 transition-colors group">
              <div className="flex items-center gap-3">
                <BookOpen className="text-indigo-600 dark:text-indigo-400" size={24} />
                <div className="text-left">
                  <h4 className="font-semibold text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">Academic Performance Transcript</h4>
                  <p className="text-xs text-slate-500">Official marksheet for Semesters 1-5</p>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParentDashboard;
