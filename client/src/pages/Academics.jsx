import { useEffect, useState } from 'react';
import { BookOpen, Download, Book, FileText, CheckCircle2 } from 'lucide-react';

export default function Academics() {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/academics/subjects`);
        if (response.ok) {
           const data = await response.json();
           setSubjects(data);
        } else {
           throw new Error('Fallback to mock');
        }
      } catch (error) {
        setSubjects([
          { id: 'CS301', name: 'Data Structures', credits: 4, attendanceTotal: 40, attendancePresent: 36, materials: 12 },
          { id: 'CS302', name: 'Operating Systems', credits: 3, attendanceTotal: 30, attendancePresent: 24, materials: 8 },
          { id: 'CS303', name: 'Database Management', credits: 4, attendanceTotal: 40, attendancePresent: 38, materials: 15 },
          { id: 'CS304', name: 'Computer Networks', credits: 3, attendanceTotal: 30, attendancePresent: 20, materials: 5 },
          { id: 'CS305', name: 'Web Technologies', credits: 2, attendanceTotal: 20, attendancePresent: 19, materials: 22 }
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchSubjects();
  }, []);

  // Helper to calculate attendance % and colors
  const getAttendanceMetrics = (present, total) => {
    const percentage = total > 0 ? Math.round((present / total) * 100) : 0;
    let color = 'bg-primary text-primary';
    if (percentage < 75) color = 'bg-red-500 text-red-500';
    if (percentage >= 75 && percentage < 85) color = 'bg-yellow-500 text-yellow-500';
    if (percentage >= 85) color = 'bg-green-500 text-green-500';
    return { percentage, color };
  };

  if (loading) {
    return <div className="p-6 h-screen flex justify-center items-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>;
  }

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
          <BookOpen className="w-8 h-8 text-primary" />
          Academics & Study Material
        </h1>
        <p className="text-muted-foreground mt-1 text-lg">Access subject outlines, materials, and track attendance.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {subjects.map((subject, idx) => {
          const { percentage, color } = getAttendanceMetrics(subject.attendancePresent, subject.attendanceTotal);
          
          return (
            <div key={idx} className="bg-background rounded-2xl border border-border shadow-sm overflow-hidden flex flex-col group hover:border-primary/40 transition-all">
               {/* Header Info */}
               <div className="p-6 border-b border-border">
                 <div className="flex justify-between items-start mb-2">
                   <div className="bg-muted px-2 py-1 rounded text-xs font-bold text-muted-foreground uppercase tracking-wider">
                     {subject.id}
                   </div>
                   <div className="text-sm font-semibold flex items-center gap-1.5 text-foreground bg-accent/10 px-2 py-1 rounded">
                     <CheckCircle2 className="w-4 h-4 text-accent" />
                     {subject.credits} Credits
                   </div>
                 </div>
                 <h2 className="text-xl font-bold text-foreground mb-4 group-hover:text-primary transition-colors">{subject.name}</h2>
                 
                 {/* Attendance Progress bar */}
                 <div className="space-y-2">
                   <div className="flex justify-between text-sm font-medium">
                     <span className="text-muted-foreground">Attendance</span>
                     <span className={color.split(' ')[1]}>{percentage}%</span>
                   </div>
                   <div className="w-full bg-muted rounded-full h-2.5 overflow-hidden">
                     <div 
                       className={`h-2.5 rounded-full ${color.split(' ')[0]}`}
                       style={{ width: `${percentage}%` }}
                     ></div>
                   </div>
                   <p className="text-xs text-muted-foreground text-right">
                     {subject.attendancePresent} / {subject.attendanceTotal} sessions attended
                   </p>
                 </div>
               </div>

               {/* Actions Bottom Bar */}
               <div className="bg-muted/30 p-4 flex gap-4 mt-auto">
                 <button className="flex-1 flex items-center justify-center gap-2 bg-background border border-border hover:bg-muted py-2 rounded-lg text-sm font-medium transition-colors">
                   <FileText className="w-4 h-4 text-primary" />
                   Syllabus
                 </button>
                 <button className="flex-1 flex items-center justify-center gap-2 bg-background border border-border hover:bg-muted py-2 rounded-lg text-sm font-medium transition-colors group/btn">
                   <Book className="w-4 h-4 text-accent group-hover/btn:animate-pulse" />
                   Materials
                   <span className="bg-primary/10 text-primary text-[10px] px-1.5 py-0.5 rounded-full font-bold ml-1">
                     {subject.materials}
                   </span>
                 </button>
               </div>
            </div>
          );
        })}

        {/* Add minimal filler block if an odd number of subjects to keep grid clean */}
        {subjects.length % 2 !== 0 && (
          <div className="hidden lg:flex border-2 border-dashed border-border rounded-2xl items-center justify-center text-muted-foreground/50 flex-col gap-2 p-6">
            <BookOpen className="w-12 h-12" />
            <p className="font-medium">More subjects will appear here</p>
          </div>
        )}
      </div>
    </div>
  );
}
