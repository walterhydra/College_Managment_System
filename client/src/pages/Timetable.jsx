import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { Calendar as CalendarIcon, Clock, MapPin, User as UserIcon } from 'lucide-react';

export default function Timetable() {
  const [timetable, setTimetable] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeDay, setActiveDay] = useState('Monday');

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  useEffect(() => {
    const fetchTimetable = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/academics/timetable`, {
          // withCredentials ideally
        });
        const data = await response.json();
        
        // Mock fallback if api fails depending on auth
        if (response.ok) {
          setTimetable(data);
        } else {
          throw new Error('Failed to fetch timetable');
        }
      } catch (error) {
        // Fallback dummy data for auth bypass in demo
         setTimetable({
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
        });
      } finally {
        setLoading(false);
      }
    };

    fetchTimetable();
  }, []);

  if (loading) {
     return <div className="p-6 h-screen flex justify-center items-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>;
  }

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
          <CalendarIcon className="w-8 h-8 text-primary" />
          Weekly Timetable
        </h1>
        <p className="text-muted-foreground mt-1 text-lg">
          View your daily class schedule and practicals.
        </p>
      </div>

      <div className="bg-background rounded-2xl border border-border shadow-sm overflow-hidden flex flex-col md:flex-row">
        {/* Day Selector Sidebar */}
        <div className="w-full md:w-64 bg-muted/30 border-b md:border-b-0 md:border-r border-border p-4 flex flex-row md:flex-col gap-2 overflow-x-auto no-scrollbar">
           {days.map(day => (
             <button
               key={day}
               onClick={() => setActiveDay(day)}
               className={`flex-shrink-0 text-left px-4 py-3 rounded-lg font-medium transition-all ${
                 activeDay === day 
                   ? 'bg-primary text-primary-foreground shadow-md' 
                   : 'text-muted-foreground hover:bg-muted hover:text-foreground'
               }`}
             >
               {day}
               {timetable?.[day]?.length > 0 && activeDay !== day && (
                 <span className="ml-2 inline-flex items-center justify-center w-5 h-5 text-[10px] bg-accent/20 text-accent rounded-full">
                   {timetable[day].length}
                 </span>
               )}
             </button>
           ))}
        </div>

        {/* Schedule View */}
        <div className="flex-1 p-6 md:p-8">
          <h2 className="text-2xl font-bold mb-6 flex items-center justify-between border-b pb-4">
             {activeDay}
             <span className="text-sm font-medium bg-muted text-muted-foreground px-3 py-1 rounded-full">
               {timetable?.[activeDay]?.length || 0} Classes
             </span>
          </h2>
          
          {timetable?.[activeDay]?.length > 0 ? (
            <div className="space-y-4">
              {timetable[activeDay].map((cls, idx) => (
                <div key={idx} className="glass-panel p-5 rounded-xl border border-border flex flex-col md:flex-row md:items-center gap-4 hover:border-primary/30 transition-colors">
                  <div className="bg-primary/10 text-primary py-2 px-4 rounded-lg font-bold text-center border border-primary/20 whitespace-nowrap">
                    {cls.time}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                        cls.type === 'Lab' ? 'bg-accent/10 text-accent border border-accent/20' : 'bg-blue-500/10 text-blue-500 border border-blue-500/20'
                      }`}>
                        {cls.type}
                      </span>
                      <h3 className="text-lg font-bold">{cls.subject}</h3>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-muted-foreground font-medium">
                      <span className="flex items-center gap-1.5 object-cover">
                        <MapPin className="w-4 h-4" />
                        {cls.room}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <UserIcon className="w-4 h-4" />
                        {cls.instructor}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="h-64 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                <CalendarIcon className="w-8 h-8 text-muted-foreground/50" />
              </div>
              <h3 className="text-xl font-bold">No Classes Scheduled</h3>
              <p className="text-muted-foreground max-w-sm mt-2">
                You have a free day! Enjoy your free time or catch up on pending assignments.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
