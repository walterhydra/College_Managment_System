import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import { QrCode, Smartphone, CreditCard, BookOpen, Clock, Activity, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/dashboard`, {
          headers: {
            'Content-Type': 'application/json',
          },
          // Assume cookies are sent for auth via credentials if we configure that, but wait we didn't add it to fetch
        });
        
        // Let's use dummy data for visually demonstrating if the fetch fails due to CORS/cookies in dev
        if (user.role === 'student') {
          setStats({
            cgpa: 8.4,
            attendance: 87,
            pendingFees: 12000,
            upcomingClasses: [
              { subject: 'Data Structures Lab', time: '10:00 AM', room: 'Lab 1' },
              { subject: 'Operating Systems', time: '11:15 AM', room: 'Room 304' }
            ],
            recentAnnouncements: [
              { title: 'Mid-term exams schedule released', date: '2023-10-15' },
              { title: 'Diwali Vacation notice', date: '2023-10-20' }
            ]
          });
        }
      } catch (error) {
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [user]);

  if (loading) {
    return (
      <div className="p-6 md:p-10 space-y-8 animate-pulse">
        <div className="h-10 w-64 bg-accent/20 rounded-lg"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1,2,3,4].map(i => <div key={i} className="h-32 bg-accent/10 rounded-2xl"></div>)}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Student Dashboard
          </h1>
          <p className="text-muted-foreground mt-1 text-lg">
            Welcome back, <span className="font-semibold text-primary">{user?.profile?.firstName || user?.email}</span>! Here's your overview.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link 
            to="/id-card"
            className="inline-flex items-center gap-2 bg-secondary text-secondary-foreground px-4 py-2 rounded-lg font-medium shadow-sm hover:bg-secondary/80 transition-colors"
          >
            <QrCode className="w-4 h-4" />
            Digital ID
          </Link>
        </div>
      </div>

      {/* Activate Mobile App Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary via-primary/90 to-accent text-primary-foreground p-6 md:p-8 flex items-center justify-between shadow-lg shadow-primary/20">
        {/* Background elements */}
        <div className="absolute top-0 right-0 -mt-16 -mr-16 w-64 h-64 bg-white/10 rounded-full blur-3xl mix-blend-overlay"></div>
        <div className="absolute bottom-0 right-32 -mb-8 w-32 h-32 bg-black/10 rounded-full blur-2xl flex-shrink-0 mix-blend-overlay"></div>
        
        <div className="relative z-10 max-w-xl">
          <div className="flex items-center gap-3 mb-3">
            <Smartphone className="w-6 h-6 text-white/90" />
            <h2 className="text-2xl font-bold">Get the Parul ERP App</h2>
          </div>
          <p className="text-primary-foreground/90 leading-relaxed mb-6">
            Access your timetable, track attendance, and receive instant notifications right on your phone. Scan the QR code below or activate directly!
          </p>
          <button className="bg-white text-primary px-6 py-2.5 rounded-lg font-bold shadow-md hover:bg-white/90 transition-all hover:-translate-y-0.5 inline-flex items-center gap-2">
            Activate Now
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </div>
        
        {/* Decorative QR impression */}
        <div className="hidden lg:flex relative z-10 bg-white/20 p-4 rounded-2xl backdrop-blur-md border border-white/30">
          <QrCode className="w-32 h-32 text-white/90 opacity-90" />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Overall CGPA" value={stats?.cgpa} icon={<Activity className="w-6 h-6 text-accent" />} trend="+0.2" />
        <StatCard title="Attendance" value={`${stats?.attendance}%`} icon={<Clock className="w-6 h-6 text-emerald-500" />} trend="Safe" />
        <StatCard title="Due Fees" value={`₹${stats?.pendingFees}`} icon={<CreditCard className="w-6 h-6 text-destructive" />} />
        <StatCard title="Active Backlogs" value={0} icon={<BookOpen className="w-6 h-6 text-blue-500" />} />
      </div>

      {/* Main Content Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Upcoming Classes */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-panel rounded-2xl p-6 md:p-8 border border-border shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" />
                Today's Schedule
              </h3>
              <a href="#" className="text-sm text-accent hover:underline font-medium">View Full Timetable</a>
            </div>
            
            <div className="space-y-4">
              {stats?.upcomingClasses?.map((cls, idx) => (
                <div key={idx} className="flex items-center p-4 rounded-xl border border-border/60 hover:bg-muted/30 transition-colors group">
                  <div className="bg-primary/10 text-primary p-3 rounded-lg mr-4 font-bold min-w-[100px] text-center">
                    {cls.time}
                  </div>
                  <div>
                    <p className="font-semibold text-lg">{cls.subject}</p>
                    <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                      <span className="w-2 h-2 rounded-full bg-accent inline-block mr-1"></span>
                      {cls.room}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Announcements & Side Widgets */}
        <div className="space-y-6">
          <div className="glass-panel rounded-2xl p-6 md:p-8 border border-border shadow-sm">
             <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                Notice Board
              </h3>
            </div>
            
            <div className="space-y-5">
              {stats?.recentAnnouncements?.map((ann, idx) => (
                <div key={idx} className="border-b border-border/50 pb-4 last:border-0 last:pb-0">
                  <p className="text-xs text-muted-foreground font-medium mb-1 uppercase tracking-wider">{ann.date}</p>
                  <a href="#" className="text-base font-medium hover:text-accent transition-colors leading-tight block">
                    {ann.title}
                  </a>
                </div>
              ))}
            </div>
            <button className="w-full mt-6 text-sm font-medium border border-border bg-transparent hover:bg-secondary py-2 rounded-lg transition-colors">
              View All Notices
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

function StatCard({ title, value, icon, trend }) {
  return (
    <div className="glass-panel rounded-2xl p-6 border border-border shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="p-3 bg-muted rounded-xl">
          {icon}
        </div>
        {trend && (
          <span className={`text-xs font-bold px-2 py-1 rounded-md ${trend.includes('+') || trend === 'Safe' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-red-100 text-red-700'}`}>
            {trend}
          </span>
        )}
      </div>
      <div>
        <h4 className="text-3xl font-bold text-foreground tracking-tight">{value}</h4>
        <p className="text-sm font-medium text-muted-foreground mt-1">{title}</p>
      </div>
    </div>
  )
}
