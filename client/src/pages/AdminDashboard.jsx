import { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Users, BookOpen, AlertCircle, Calendar as CalendarIcon, Search, UserCheck, Download, CheckCircle, X } from 'lucide-react';
import { toast } from 'react-hot-toast';

const UserAttendanceCard = ({ user, status, setStatus, isReadOnly }) => {
  return (
    <div className={`flex flex-col p-3 rounded-lg border transition-all ${status === 'present' ? 'border-green-500/50 bg-green-500/5' : status === 'absent' ? 'border-red-500/50 bg-red-500/5' : status === 'late' ? 'border-amber-500/50 bg-amber-500/5' : 'border-border bg-background'}`}>
      <div className="flex justify-between items-start mb-3">
        <div className="truncate pr-2">
          <p className="font-bold text-sm truncate">{user.firstName} {user.lastName}</p>
          <p className="text-xs text-muted-foreground truncate">{user.enrollmentNo || user.department || 'User'}</p>
        </div>
      </div>
      <div className="flex bg-muted/30 p-1 rounded-md mt-auto w-full">
        <button disabled={isReadOnly} onClick={() => setStatus('present')} className={`flex-1 text-xs py-1.5 rounded font-medium ${status === 'present' ? 'bg-green-500 text-white shadow-sm' : 'text-muted-foreground hover:bg-background'}`}>Present</button>
        <button disabled={isReadOnly} onClick={() => setStatus('absent')} className={`flex-1 text-xs py-1.5 rounded font-medium ${status === 'absent' ? 'bg-red-500 text-white shadow-sm' : 'text-muted-foreground hover:bg-background'}`}>Absent</button>
        <button disabled={isReadOnly} onClick={() => setStatus('late')} className={`flex-1 text-xs py-1.5 rounded font-medium ${status === 'late' ? 'bg-amber-500 text-white shadow-sm' : 'text-muted-foreground hover:bg-background'}`}>Late</button>
      </div>
    </div>
  );
};

export default function AdminDashboard() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalStudents: 0,
    totalStaff: 0,
    feeCollection: '₹0',
    activeComplaints: 0
  });

  const [alerts, setAlerts] = useState([]);
  
  const [showGrievances, setShowGrievances] = useState(false);
  const [grievances, setGrievances] = useState([]);

  // Attendance State
  const [showAttendanceModal, setShowAttendanceModal] = useState(false);
  const [attendanceData, setAttendanceData] = useState({ students: [], staff: [] });
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [userStatuses, setUserStatuses] = useState({}); // { userId: 'present'|'absent'|'late' }
  const [isAttendanceLoading, setIsAttendanceLoading] = useState(false);
  const [isReadOnly, setIsReadOnly] = useState(false);
  const [attendanceError, setAttendanceError] = useState('');
  
  // Advanced Attendance UI State
  const [attendanceTab, setAttendanceTab] = useState('students');
  const [filterProgram, setFilterProgram] = useState('');

  // Derived filtered students
  const filteredStudents = attendanceData.students.filter(student => {
    if (filterProgram && student.department !== filterProgram) return false;
    // Assuming semester is stored in department or we just rely on program for now since schema has program/semester
    return true; 
  });

  useEffect(() => {
    fetchStats();
    fetchAlerts();
  }, []);

  async function fetchStats() {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/dashboard`, {
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        setStats({
          totalStudents: data.totalStudents || 0,
          totalStaff: data.totalStaff || 0,
          feeCollection: data.feeCollection || '₹0',
          activeComplaints: data.activeComplaints || 0
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  async function fetchAlerts() {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/admin/activity-logs`, {
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        setAlerts(data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchGrievances = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/operations/grievances`, {
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        setGrievances(data);
        setShowGrievances(true);
      } else {
        toast.error('Failed to load grievances');
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to load grievances');
    }
  };

  const resolveGrievance = async (id) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/operations/grievances/${id}/resolve`, {
        method: 'POST',
        credentials: 'include'
      });
      if (response.ok) {
        toast.success('Grievance resolved');
        setGrievances(grievances.filter(g => g.id !== id));
        fetchStats();
      } else {
        toast.error('Failed to resolve');
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to resolve');
    }
  };


  const handleAttendanceClick = async () => {
    setShowAttendanceModal(true);
    setIsAttendanceLoading(true);
    setAttendanceError('');
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/admin/attendance/users`, {
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Failed to fetch users');
      const data = await response.json();
      setAttendanceData(data);
      checkAttendanceStatus(selectedDate);
    } catch (error) {
      console.error(error);
      setAttendanceError('Could not load users for attendance.');
    } finally {
      setIsAttendanceLoading(false);
    }
  };

  const checkAttendanceStatus = async (date) => {
    setIsAttendanceLoading(true);
    setAttendanceError('');
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/admin/attendance/check?date=${date}`, {
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Failed to check status');
      const data = await response.json();
      
      if (data.exists) {
        setIsReadOnly(true);
        const statusMap = {};
        data.records.forEach(r => {
          statusMap[r.user._id] = r.status;
        });
        setUserStatuses(statusMap);
      } else {
        setIsReadOnly(false);
        setUserStatuses({});
      }
    } catch (error) {
      console.error(error);
      setAttendanceError('Could not check attendance status.');
    } finally {
      setIsAttendanceLoading(false);
    }
  };

  const handleDateChange = (e) => {
    const newDate = e.target.value;
    setSelectedDate(newDate);
    checkAttendanceStatus(newDate);
  };

  const setUserStatus = (userId, status) => {
    if (isReadOnly) return;
    setUserStatuses(prev => ({
      ...prev,
      [userId]: status
    }));
  };

  const bulkSetStatus = (users, status) => {
    if (isReadOnly) return;
    setUserStatuses(prev => {
      const newMap = { ...prev };
      users.forEach(u => {
        newMap[u._id] = status;
      });
      return newMap;
    });
  };

  const submitAttendance = async () => {
    if (isReadOnly) return;
    setIsAttendanceLoading(true);
    setAttendanceError('');
    try {
      const records = [];
      
      attendanceData.students.forEach(u => {
        if (userStatuses[u._id]) {
          records.push({ user: u._id, role: 'student', status: userStatuses[u._id] });
        }
      });
      
      attendanceData.staff.forEach(u => {
        if (userStatuses[u._id]) {
          records.push({ user: u._id, role: 'staff', status: userStatuses[u._id] });
        }
      });
      
      if (records.length === 0) {
        throw new Error('Please mark attendance for at least one user.');
      }

      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/admin/attendance/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ date: selectedDate, records })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to submit attendance');
      }
      
      toast.success('Attendance marked successfully!');
      setIsReadOnly(true);
    } catch (error) {
      setAttendanceError(error.message);
      toast.error(error.message);
    } finally {
      setIsAttendanceLoading(false);
    }
  };

  const exportToCSV = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/admin/export-users`, {
        credentials: 'include'
      });
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "student_database_backup.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success('Database backup exported successfully');
      } else {
        toast.error('Export failed');
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to export database');
    }
  };

  const statCards = [
    { label: 'Total Students', value: stats.totalStudents, icon: <Users size={24} className="text-blue-500"/>, color: 'bg-blue-500/10 border-blue-500/20' },
    { label: 'Pending Queries', value: stats.activeComplaints, icon: <AlertCircle size={24} className="text-amber-500"/>, color: 'bg-amber-500/10 border-amber-500/20' },
    { label: 'Total Staff', value: stats.totalStaff, icon: <UserCheck size={24} className="text-green-500"/>, color: 'bg-green-500/10 border-green-500/20' },
    { label: 'Fee Collection', value: stats.feeCollection, icon: <BookOpen size={24} className="text-purple-500"/>, color: 'bg-purple-500/10 border-purple-500/20' }
  ];

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in zoom-in-95 duration-500 relative">

      {/* Attendance Modal */}
      {showAttendanceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-background border border-border rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="p-5 border-b border-border flex justify-between items-center bg-muted/20">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-primary/10 text-primary rounded-lg">
                  <UserCheck size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Mark Attendance</h2>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm text-muted-foreground">Date:</span>
                    <input 
                      type="date" 
                      value={selectedDate}
                      max={new Date().toISOString().split('T')[0]}
                      onChange={handleDateChange}
                      className="text-sm bg-background border border-border rounded px-2 py-1 outline-none focus:border-primary"
                    />
                  </div>
                </div>
              </div>
              <button onClick={() => setShowAttendanceModal(false)} className="text-muted-foreground hover:text-foreground">
                <X size={24} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-0 overflow-y-auto flex-1 bg-muted/5">
              {isAttendanceLoading ? (
                <div className="flex flex-col items-center justify-center p-12 text-muted-foreground">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"></div>
                  <p>Loading records...</p>
                </div>
              ) : attendanceError ? (
                <div className="p-8 text-center text-red-500 font-medium">
                  <AlertCircle className="mx-auto mb-2" size={32} />
                  {attendanceError}
                </div>
              ) : (
                <div className="p-6 space-y-8">
                  {isReadOnly && (
                    <div className="bg-amber-500/10 border border-amber-500/20 text-amber-700 p-4 rounded-lg flex items-center gap-3">
                      <CheckCircle className="shrink-0" />
                      <div>
                        <p className="font-bold">Attendance already submitted for this date</p>
                        <p className="text-sm">Viewing records in read-only mode.</p>
                      </div>
                    </div>
                  )}

                  {/* Tabs & Filters */}
                  <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-background p-4 rounded-lg border border-border">
                    <div className="flex bg-muted/50 p-1 rounded-md w-full md:w-auto">
                      <button 
                        onClick={() => setAttendanceTab('students')}
                        className={`flex-1 md:flex-none px-6 py-2 rounded-sm text-sm font-medium transition-colors ${attendanceTab === 'students' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                      >
                        Students
                      </button>
                      <button 
                        onClick={() => setAttendanceTab('staff')}
                        className={`flex-1 md:flex-none px-6 py-2 rounded-sm text-sm font-medium transition-colors ${attendanceTab === 'staff' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                      >
                        Faculty & Staff
                      </button>
                    </div>

                    {attendanceTab === 'students' && (
                      <div className="flex items-center gap-3 w-full md:w-auto">
                        <select 
                          value={filterProgram} 
                          onChange={(e) => setFilterProgram(e.target.value)}
                          className="bg-background border border-border text-sm rounded px-3 py-2 outline-none focus:border-primary flex-1 md:w-48"
                        >
                          <option value="">All Departments</option>
                          {[...new Set(attendanceData.students.map(s => s.department).filter(Boolean))].map(dept => (
                            <option key={dept} value={dept}>{dept}</option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>

                  {/* Dynamic Section Based on Tab */}
                  <div className="bg-background border border-border rounded-xl p-5 shadow-sm">
                    {attendanceTab === 'staff' ? (
                      <div>
                        <div className="flex justify-between items-center mb-4 pb-3 border-b border-border">
                          <h3 className="font-bold text-lg">Staff Directory</h3>
                          {!isReadOnly && (
                            <div className="flex gap-2">
                              <button onClick={() => bulkSetStatus(attendanceData.staff, 'present')} className="text-xs font-bold text-green-600 bg-green-500/10 hover:bg-green-500/20 px-3 py-1.5 rounded transition-colors">Mark All Present</button>
                              <button onClick={() => bulkSetStatus(attendanceData.staff, 'absent')} className="text-xs font-bold text-red-600 bg-red-500/10 hover:bg-red-500/20 px-3 py-1.5 rounded transition-colors">Mark All Absent</button>
                            </div>
                          )}
                        </div>
                        {attendanceData.staff.length === 0 ? (
                          <p className="text-center p-8 text-muted-foreground">No staff found.</p>
                        ) : (
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            {attendanceData.staff.map(user => (
                              <UserAttendanceCard key={user._id} user={user} status={userStatuses[user._id]} setStatus={(status) => setUserStatus(user._id, status)} isReadOnly={isReadOnly} />
                            ))}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div>
                        <div className="flex justify-between items-center mb-4 pb-3 border-b border-border">
                          <h3 className="font-bold text-lg">Student Directory</h3>
                          {!isReadOnly && (
                            <div className="flex gap-2">
                              <button onClick={() => bulkSetStatus(filteredStudents, 'present')} className="text-xs font-bold text-green-600 bg-green-500/10 hover:bg-green-500/20 px-3 py-1.5 rounded transition-colors">Mark All Present</button>
                              <button onClick={() => bulkSetStatus(filteredStudents, 'absent')} className="text-xs font-bold text-red-600 bg-red-500/10 hover:bg-red-500/20 px-3 py-1.5 rounded transition-colors">Mark All Absent</button>
                            </div>
                          )}
                        </div>
                        {filteredStudents.length === 0 ? (
                          <p className="text-center p-8 text-muted-foreground">No students match the current filters.</p>
                        ) : (
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            {filteredStudents.map(user => (
                              <UserAttendanceCard key={user._id} user={user} status={userStatuses[user._id]} setStatus={(status) => setUserStatus(user._id, status)} isReadOnly={isReadOnly} />
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-border bg-background flex justify-between items-center">
              <div className="text-sm flex gap-4 text-muted-foreground">
                <span>Total: <span className="font-bold text-foreground">{Object.keys(userStatuses).length}</span> processed</span>
                <span className="text-green-600"><span className="font-bold">{Object.values(userStatuses).filter(s => s === 'present').length}</span> Present</span>
                <span className="text-red-500"><span className="font-bold">{Object.values(userStatuses).filter(s => s === 'absent').length}</span> Absent</span>
                <span className="text-amber-500"><span className="font-bold">{Object.values(userStatuses).filter(s => s === 'late').length}</span> Late</span>
              </div>
              <div className="flex gap-3">
                <button 
                  onClick={() => setShowAttendanceModal(false)}
                  className="px-4 py-2 border border-border rounded-lg font-medium hover:bg-muted transition-colors"
                >
                  Close
                </button>
                {isReadOnly ? (
                  <button disabled className="px-4 py-2 bg-green-500/20 text-green-700 border border-green-500/30 rounded-lg font-bold flex items-center gap-2 cursor-not-allowed">
                    <CheckCircle size={18} /> Submitted
                  </button>
                ) : (
                  <button 
                    onClick={submitAttendance}
                    disabled={isAttendanceLoading || (attendanceData.students.length === 0 && attendanceData.staff.length === 0)}
                    className="px-6 py-2 bg-primary text-primary-foreground rounded-lg font-bold hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center gap-2"
                  >
                    {isAttendanceLoading ? <span className="animate-pulse">Submitting...</span> : 'Submit Attendance'}
                  </button>
                )}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Grievances Modal */}
      {showGrievances && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-background border border-border rounded-xl shadow-xl w-full max-w-2xl max-h-[80vh] flex flex-col overflow-hidden">
            <div className="p-5 border-b border-border flex justify-between items-center bg-muted/20">
              <h2 className="text-xl font-bold flex items-center gap-2"><AlertCircle className="text-amber-500" /> Pending Grievances</h2>
              <button onClick={() => setShowGrievances(false)} className="text-muted-foreground hover:text-foreground">
                <X size={24} />
              </button>
            </div>
            <div className="p-0 overflow-y-auto flex-1">
              {grievances.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">No pending grievances!</div>
              ) : (
                <div className="divide-y divide-border">
                  {grievances.map(g => (
                    <div key={g.id} className="p-5 flex flex-col sm:flex-row justify-between gap-4 hover:bg-muted/10 transition-colors">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-bold bg-amber-500/10 text-amber-600 px-2 py-0.5 rounded border border-amber-500/20">{g.status}</span>
                          <span className="text-xs text-muted-foreground">{g.date}</span>
                        </div>
                        <h3 className="font-bold">{g.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1">Reported by: {g.student}</p>
                      </div>
                      <div className="flex items-center">
                        <button 
                          onClick={() => resolveGrievance(g.id)}
                          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 flex items-center gap-2"
                        >
                          <CheckCircle size={16} /> Resolve
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
            Welcome back, {user?.profile?.firstName || 'Admin'}
          </h1>
          <p className="text-muted-foreground mt-1 text-lg">Staff & Administration Control Panel</p>
        </div>
        <div className="px-3 py-1 pb-1.5 bg-primary/10 text-primary border border-primary/20 rounded-full text-sm font-bold tracking-wider uppercase">
           Role: {user?.role || 'Admin'}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, idx) => (
          <div key={idx} className={`rounded-xl border p-6 flex flex-col items-center text-center justify-center space-y-3 shadow-sm ${stat.color}`}>
            <div className="bg-background p-3 rounded-full shadow-sm">{stat.icon}</div>
            <div>
              <p className="text-3xl font-black text-foreground">{stat.value}</p>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mt-1">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Col - Quick Actions */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-background border border-border rounded-xl shadow-sm overflow-hidden">
            <div className="p-5 border-b border-border flex justify-between items-center bg-muted/20">
               <h2 className="text-xl font-bold">Quick Actions</h2>
            </div>
            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button 
                  onClick={handleAttendanceClick}
                  className="p-4 border border-border rounded-xl hover:border-primary hover:bg-primary/5 transition-all text-left flex items-start gap-4"
                >
                   <div className="p-3 bg-primary/10 rounded-lg text-primary shrink-0"><UserCheck size={24} /></div>
                   <div>
                     <h3 className="font-bold mb-1">Mark Attendance</h3>
                     <p className="text-sm text-muted-foreground line-clamp-2">Select a batch and date to log student presence.</p>
                   </div>
                </button>
                <button 
                  onClick={fetchGrievances}
                  className="p-4 border border-border rounded-xl hover:border-primary hover:bg-primary/5 transition-all text-left flex items-start gap-4"
                >
                   <div className="p-3 bg-amber-500/10 rounded-lg text-amber-600 shrink-0"><AlertCircle size={24} /></div>
                   <div>
                     <h3 className="font-bold mb-1">Resolve Grievances</h3>
                     <p className="text-sm text-muted-foreground line-clamp-2">View and resolve pending student tickets.</p>
                   </div>
                </button>
                <button 
                  onClick={exportToCSV}
                  className="p-4 border border-border rounded-xl hover:border-primary hover:bg-primary/5 transition-all text-left flex items-start gap-4 sm:col-span-2"
                >
                   <div className="p-3 bg-green-500/10 rounded-lg text-green-600 shrink-0"><Download size={24} /></div>
                   <div>
                     <h3 className="font-bold mb-1">Database Backup & Export</h3>
                     <p className="text-sm text-muted-foreground line-clamp-2">Download a full CSV dump of the student directory and enrollment mapping.</p>
                   </div>
                </button>
            </div>
          </div>

          <div className="bg-background border border-border rounded-xl shadow-sm overflow-hidden flex flex-col justify-center items-center p-12 text-center">
            <div className="p-4 bg-primary/10 text-primary rounded-full mb-4">
              <Users size={32} />
            </div>
            <h2 className="text-xl font-bold mb-2">Student Directory</h2>
            <p className="text-muted-foreground mb-6 max-w-sm">Manage student profiles, search by enrollment number, and export database records.</p>
            <button 
              onClick={() => navigate('/directory')}
              className="px-6 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors shadow-sm"
            >
              Open Directory
            </button>
          </div>
        </div>

        {/* Right Col - Feed */}
        <div className="space-y-6">
           <div className="bg-background border border-border rounded-xl shadow-sm flex flex-col h-full">
             <div className="p-5 border-b border-border bg-muted/20">
               <h2 className="text-xl font-bold">System Alerts</h2>
             </div>
             <div className="p-0 divide-y divide-border flex-1">
                {alerts.length > 0 ? alerts.map((alert, i) => (
                  <div key={i} className="p-4 hover:bg-muted/30 transition-colors">
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-xs font-bold bg-blue-500/10 text-blue-600 px-2 py-0.5 rounded border border-blue-500/20">{alert.action}</span>
                      <span className="text-xs text-muted-foreground">{new Date(alert.createdAt).toLocaleDateString()}</span>
                    </div>
                    <p className="text-sm font-medium">{alert.description || `User ${alert.user?.email || 'Unknown'} performed an action.`}</p>
                  </div>
                )) : (
                  <div className="p-8 text-center text-muted-foreground">No recent alerts.</div>
                )}
             </div>
             <button className="w-full text-center p-3 text-sm font-bold text-primary hover:bg-primary/5 transition-colors border-t border-border mt-auto">
               View All Audit Logs
             </button>
           </div>
        </div>

      </div>
    </div>
  );
}
