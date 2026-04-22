import { useEffect, useState } from 'react';
import { Award, BookOpen, Download, TrendingUp, CheckCircle, FileText } from 'lucide-react';

export default function Exams() {
  const [examData, setExamData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchExamData();
  }, []);

  const fetchExamData = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/advanced/exams/results`);
      if (response.ok) {
        const data = await response.json();
        setExamData(data);
      } else {
        throw new Error('Fallback to mock');
      }
    } catch (error) {
      setExamData({
        cgpa: 8.42,
        totalCredits: 96,
        earnedCredits: 96,
        semesters: [
          {
            semester: 'Semester 4',
            sgpa: 8.6,
            status: 'PASS',
            subjects: [
              { code: 'CS201', name: 'Database Management', credits: 4, grade: 'A', points: 9 },
              { code: 'CS202', name: 'Operating Systems', credits: 4, grade: 'B+', points: 8 },
              { code: 'CS203', name: 'Computer Networks', credits: 3, grade: 'A', points: 9 },
              { code: 'CS204', name: 'Software Engineering', credits: 3, grade: 'B', points: 7 },
              { code: 'CS201L', name: 'DBMS Lab', credits: 2, grade: 'O', points: 10 }
            ]
          },
          {
            semester: 'Semester 3',
            sgpa: 8.2,
            status: 'PASS',
            subjects: [
              { code: 'CS151', name: 'Data Structures', credits: 4, grade: 'B+', points: 8 },
              { code: 'EE101', name: 'Basic Electrical', credits: 3, grade: 'B', points: 7 },
              { code: 'MA201', name: 'Discrete Mathematics', credits: 4, grade: 'A', points: 9 },
              { code: 'HS102', name: 'Communication Skills', credits: 2, grade: 'A', points: 9 }
            ]
          }
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  const getGradeColor = (grade) => {
    switch (grade) {
      case 'O': return 'text-purple-500 bg-purple-500/10 border-purple-500/20';
      case 'A+': return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
      case 'A': return 'text-green-500 bg-green-500/10 border-green-500/20';
      case 'B+': return 'text-yellow-600 bg-yellow-500/10 border-yellow-500/20';
      case 'B': return 'text-orange-500 bg-orange-500/10 border-orange-500/20';
      case 'F': return 'text-red-500 bg-red-500/10 border-red-500/20';
      default: return 'text-muted-foreground bg-muted border-border';
    }
  };

  if (loading) {
    return <div className="p-6 h-screen flex justify-center items-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>;
  }

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
          <Award className="w-8 h-8 text-primary" />
          Examinations & Results
        </h1>
        <p className="text-muted-foreground mt-1 text-lg">View your academic performance, marksheets, and CGPA trends.</p>
      </div>

      {/* Hero Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-background rounded-2xl border border-border p-6 shadow-sm flex items-center justify-between">
           <div>
             <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-1">Cumulative GPA</p>
             <h2 className="text-4xl font-black text-primary">{examData.cgpa} <span className="text-xl text-muted-foreground font-medium">/ 10</span></h2>
           </div>
           <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
             <TrendingUp className="w-8 h-8 text-primary" />
           </div>
        </div>
        <div className="bg-background rounded-2xl border border-border p-6 shadow-sm flex items-center justify-between">
           <div>
             <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-1">Total Credits</p>
             <h2 className="text-4xl font-black text-foreground">{examData.earnedCredits} <span className="text-xl text-muted-foreground font-medium">/ {examData.totalCredits}</span></h2>
           </div>
           <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center">
             <BookOpen className="w-8 h-8 text-green-500" />
           </div>
        </div>
        <div className="bg-background rounded-2xl border border-border p-6 shadow-sm flex items-center justify-between md:col-span-1 sm:col-span-2">
           <div>
             <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-1">Overall Status</p>
             <h2 className="text-3xl font-black text-green-500 flex items-center gap-2">
               CLEARED
               <CheckCircle className="w-6 h-6" />
             </h2>
           </div>
        </div>
      </div>

      {/* Semester Results */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold border-b pb-2">Semester Transcripts</h2>
        
        {examData.semesters.map((sem, idx) => (
          <div key={idx} className="bg-background rounded-2xl border border-border shadow-sm overflow-hidden">
             
             {/* Sem Header */}
             <div className="bg-muted/30 p-5 border-b border-border flex flex-wrap items-center justify-between gap-4">
               <div>
                  <h3 className="text-xl font-bold flex items-center gap-2">
                    {sem.semester}
                    <span className="text-xs bg-green-500/10 text-green-600 px-2 py-0.5 rounded border border-green-500/20">{sem.status}</span>
                  </h3>
               </div>
               <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider">SGPA</p>
                    <p className="text-xl font-black text-primary">{sem.sgpa}</p>
                  </div>
                  <button className="flex items-center gap-2 bg-background border border-border hover:bg-muted px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                    <Download className="w-4 h-4 text-primary" />
                    Marksheet
                  </button>
               </div>
             </div>

             {/* Subjects Table */}
             <div className="overflow-x-auto">
               <table className="w-full text-left border-collapse">
                 <thead>
                   <tr className="bg-muted/10 border-b border-border">
                     <th className="p-4 text-sm font-bold text-muted-foreground">Course Code</th>
                     <th className="p-4 text-sm font-bold text-muted-foreground">Subject Name</th>
                     <th className="p-4 text-sm font-bold text-muted-foreground text-center">Credits</th>
                     <th className="p-4 text-sm font-bold text-muted-foreground text-center">Grade Points</th>
                     <th className="p-4 text-sm font-bold text-muted-foreground text-center">Letter Grade</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-border">
                   {sem.subjects.map((sub, sIdx) => (
                     <tr key={sIdx} className="hover:bg-muted/20 transition-colors">
                       <td className="p-4 text-sm font-mono font-medium">{sub.code}</td>
                       <td className="p-4 text-sm font-bold">{sub.name}</td>
                       <td className="p-4 text-sm text-center font-medium">{sub.credits}</td>
                       <td className="p-4 text-sm text-center font-medium">{sub.points}</td>
                       <td className="p-4 text-center">
                         <span className={`inline-block px-2 py-1 rounded font-bold text-xs border ${getGradeColor(sub.grade)}`}>
                           {sub.grade}
                         </span>
                       </td>
                     </tr>
                   ))}
                 </tbody>
               </table>
             </div>
          </div>
        ))}
      </div>

      {/* Admit Card Section Placeholder */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl border border-border p-8 shadow-sm text-white flex flex-col md:flex-row items-center justify-between gap-6">
         <div>
           <h2 className="text-2xl font-bold flex items-center gap-2 mb-2">
             <FileText className="w-6 h-6 text-accent" />
             Upcoming Examination
           </h2>
           <p className="text-slate-300">Semester 5 Mid-Term Examinations begin completely offline on 20th Oct 2023.</p>
         </div>
         <button className="bg-accent hover:bg-accent/90 text-white px-6 py-3 rounded-lg font-bold transition-colors whitespace-nowrap shadow-lg">
           Download Admit Card
         </button>
      </div>

    </div>
  );
}
