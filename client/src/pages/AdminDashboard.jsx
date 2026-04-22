import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Users, BookOpen, AlertCircle, Calendar as CalendarIcon, Search, UserCheck, Download } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function AdminDashboard() {
  const { user } = useContext(AuthContext);

  const mockStats = [
    { label: 'Total Students', value: '4,281', icon: <Users size={24} className="text-blue-500"/>, color: 'bg-blue-500/10 border-blue-500/20' },
    { label: 'Pending Queries', value: '18', icon: <AlertCircle size={24} className="text-amber-500"/>, color: 'bg-amber-500/10 border-amber-500/20' },
    { label: 'Active Courses', value: '124', icon: <BookOpen size={24} className="text-green-500"/>, color: 'bg-green-500/10 border-green-500/20' },
    { label: 'Upcoming Exams', value: '5', icon: <CalendarIcon size={24} className="text-purple-500"/>, color: 'bg-purple-500/10 border-purple-500/20' }
  ];

  const handleAttendanceClick = () => {
    toast.success('Entering Attendance marking mode for CS201 - Section A');
  };

  const exportToCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8,EnrollmentNo,Name,Program,Semester,Status\n190410101010,Milan Patel,BTech CSE,8,Active\n190410101011,Rahul Sharma,BTech CSE,8,Active";
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "student_database_backup.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Database backup exported successfully');
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in zoom-in-95 duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
            Welcome back, {user?.profile?.firstName || 'Faculty'}
          </h1>
          <p className="text-muted-foreground mt-1 text-lg">Staff & Administration Control Panel</p>
        </div>
        <div className="px-3 py-1 pb-1.5 bg-primary/10 text-primary border border-primary/20 rounded-full text-sm font-bold tracking-wider uppercase">
           Role: {user?.role || 'Staff'}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {mockStats.map((stat, idx) => (
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
                  className="p-4 border border-border rounded-xl hover:border-primary hover:bg-primary/5 transition-all text-left flex items-start gap-4"
                >
                   <div className="p-3 bg-amber-500/10 rounded-lg text-amber-600 shrink-0"><AlertCircle size={24} /></div>
                   <div>
                     <h3 className="font-bold mb-1">Resolve Grievances</h3>
                     <p className="text-sm text-muted-foreground line-clamp-2">18 pending tickets requiring administrative response.</p>
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

          <div className="bg-background border border-border rounded-xl shadow-sm overflow-hidden">
             <div className="p-5 border-b border-border bg-muted/20 flex flex-wrap gap-4 items-center justify-between">
               <h2 className="text-xl font-bold">Student Directory Search</h2>
               <div className="relative">
                 <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                 <input type="text" placeholder="Search enrollment no..." className="pl-9 pr-4 py-2 border border-border rounded-md text-sm focus:outline-none focus:border-primary bg-background w-full sm:w-64" />
               </div>
             </div>
             <div className="p-8 text-center text-muted-foreground flex flex-col items-center justify-center min-h-[200px]">
                <Users size={32} className="mb-3 opacity-20" />
                <p>Use the search bar above to fetch an individual student's complete ledger, attendance, and exam details.</p>
             </div>
          </div>
        </div>

        {/* Right Col - Feed */}
        <div className="space-y-6">
           <div className="bg-background border border-border rounded-xl shadow-sm flex flex-col h-full">
             <div className="p-5 border-b border-border bg-muted/20">
               <h2 className="text-xl font-bold">System Alerts</h2>
             </div>
             <div className="p-0 divide-y divide-border flex-1">
                <div className="p-4 hover:bg-muted/30 transition-colors">
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-xs font-bold bg-amber-500/10 text-amber-600 px-2 py-0.5 rounded border border-amber-500/20">WARNING</span>
                    <span className="text-xs text-muted-foreground">1hr ago</span>
                  </div>
                  <p className="text-sm font-medium">Semester 6 Data Structures results pending from 3 faculty members.</p>
                </div>
                <div className="p-4 hover:bg-muted/30 transition-colors">
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-xs font-bold bg-blue-500/10 text-blue-600 px-2 py-0.5 rounded border border-blue-500/20">NETWORK</span>
                    <span className="text-xs text-muted-foreground">3hrs ago</span>
                  </div>
                  <p className="text-sm font-medium">Scheduled ERP maintenance at 02:00 AM IST this Sunday.</p>
                </div>
                <div className="p-4 hover:bg-muted/30 transition-colors">
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-xs font-bold bg-green-500/10 text-green-600 px-2 py-0.5 rounded border border-green-500/20">SYSTEM</span>
                    <span className="text-xs text-muted-foreground">Yesterday</span>
                  </div>
                  <p className="text-sm font-medium">All student fee ledgers successfully synced with Razerpay ledger batch.</p>
                </div>
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
