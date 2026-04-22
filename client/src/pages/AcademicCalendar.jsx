import { useEffect, useState } from 'react';
import { Calendar as CalendarIcon, Filter, Layers, GraduationCap, PartyPopper } from 'lucide-react';

export default function AcademicCalendar() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, holiday, exam, academic, event

  useEffect(() => {
    const fetchCalendar = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/academics/calendar`);
        if (response.ok) {
           const data = await response.json();
           setEvents(data);
        } else {
           throw new Error('Fallback to mock');
        }
      } catch (error) {
        setEvents([
          { date: '2023-08-01', title: 'Odd Semester Starts', type: 'academic' },
          { date: '2023-08-15', title: 'Independence Day', type: 'holiday' },
          { date: '2023-09-05', title: 'Teachers Day Celebration', type: 'event' },
          { date: '2023-10-15', title: 'Mid-term Examinations Begin', type: 'exam' },
          { date: '2023-10-24', title: 'Dussehra', type: 'holiday' },
          { date: '2023-11-10', title: 'Diwali Vacation Starts', type: 'holiday' },
          { date: '2023-12-05', title: 'End-term Practical Exams', type: 'exam' },
          { date: '2023-12-15', title: 'End-term Theory Exams', type: 'exam' },
          { date: '2023-12-25', title: 'Christmas', type: 'holiday' }
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchCalendar();
  }, []);

  const getTypeStyle = (type) => {
    switch(type) {
      case 'holiday': return 'bg-red-500/10 text-red-500 border-red-500/20';
      case 'exam': return 'bg-accent/10 text-accent border-accent/20';
      case 'event': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      case 'academic': return 'bg-primary/10 text-primary border-primary/20';
      default: return 'bg-muted text-muted-foreground border-border';
    }
  };

  const getIcon = (type) => {
    switch(type) {
      case 'holiday': return <PartyPopper className="w-5 h-5 text-red-500" />;
      case 'exam': return <GraduationCap className="w-5 h-5 text-accent" />;
      case 'event': return <CalendarIcon className="w-5 h-5 text-yellow-500" />;
      case 'academic': return <Layers className="w-5 h-5 text-primary" />;
      default: return null;
    }
  };

  const filteredEvents = filter === 'all' ? events : events.filter(e => e.type === filter);

  if (loading) {
    return <div className="p-6 h-screen flex justify-center items-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>;
  }

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Academic Calendar</h1>
          <p className="text-muted-foreground mt-1 text-lg">Yearly holidays, exams, and important academic dates.</p>
        </div>
        
        <div className="flex items-center gap-2 bg-background p-1.5 rounded-lg border border-border shadow-sm">
           <Filter className="w-4 h-4 ml-2 text-muted-foreground" />
           <select 
             className="bg-transparent border-none outline-none text-sm font-medium py-1 pr-4 mr-2 custom-select"
             value={filter}
             onChange={(e) => setFilter(e.target.value)}
           >
             <option value="all">All Events</option>
             <option value="academic">Academic Schedule</option>
             <option value="holiday">Holidays</option>
             <option value="exam">Examinations</option>
             <option value="event">Registrations/Events</option>
           </select>
        </div>
      </div>

      <div className="bg-background rounded-2xl border border-border shadow-sm overflow-hidden">
        <div className="grid grid-cols-1 divide-y divide-border">
           {filteredEvents.map((event, idx) => {
             const dateObj = new Date(event.date);
             const month = dateObj.toLocaleString('default', { month: 'short' });
             const day = dateObj.getDate();
             const weekday = dateObj.toLocaleString('default', { weekday: 'long' });

             return (
               <div key={idx} className="p-4 sm:p-6 flex items-center gap-6 hover:bg-muted/30 transition-colors group">
                 {/* Date Block */}
                 <div className="flex flex-col items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-muted rounded-xl border border-border shrink-0 group-hover:border-primary/30 transition-colors">
                   <span className="text-xs sm:text-sm font-bold text-primary uppercase tracking-widest">{month}</span>
                   <span className="text-2xl sm:text-3xl font-black leading-none mt-1">{day}</span>
                 </div>

                 {/* Info Block */}
                 <div className="flex-1">
                   <h3 className="text-lg sm:text-xl font-bold text-foreground">{event.title}</h3>
                   <div className="flex flex-wrap items-center gap-3 mt-2">
                     <span className="text-sm font-medium text-muted-foreground">{weekday}, {dateObj.getFullYear()}</span>
                     <span className={`text-xs font-bold px-2 py-0.5 rounded uppercase tracking-wider border flex items-center gap-1 ${getTypeStyle(event.type)}`}>
                       {event.type}
                     </span>
                   </div>
                 </div>

                 {/* Icon Block (Hidden on very small screens) */}
                 <div className="hidden sm:flex w-12 h-12 rounded-full bg-background border border-border items-center justify-center shadow-sm">
                   {getIcon(event.type)}
                 </div>
               </div>
             );
           })}
        </div>

        {filteredEvents.length === 0 && (
          <div className="p-12 text-center text-muted-foreground">
             <CalendarIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
             <p>No events found for the selected filter.</p>
          </div>
        )}
      </div>
    </div>
  );
}
