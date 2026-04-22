import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { FileText, Download, Plus, Trash2, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import jsPDF from 'jspdf';
import { toast } from 'react-hot-toast';

export default function ResumeBuilder() {
  const { user } = useContext(AuthContext);

  const [resumeData, setResumeData] = useState({
    name: user?.name || 'Student Name',
    email: user?.email || 'student@paruluniversity.ac.in',
    phone: user?.phone || '+91 9876543210',
    address: 'Vadodara, Gujarat',
    objective: 'Motivated software engineering student seeking an entry-level position to utilize my skills in full-stack development and problem-solving.',
    education: [
      { institution: 'Parul University', degree: 'B.Tech in Computer Science', year: '2021 - 2025', cgpa: '8.42' },
      { institution: 'Delhi Public School', degree: 'Higher Secondary (XII)', year: '2019 - 2021', cgpa: '92%' }
    ],
    experience: [
      { role: 'Web Development Intern', company: 'Tech Solutions Inc.', duration: 'May 2023 - July 2023', description: 'Developed interactive UI components using React and integrated RESTful APIs.' }
    ],
    skills: 'JavaScript, React.js, Node.js, Express.js, MongoDB, Java, C++, Git, SQL',
    projects: [
      { title: 'College ERP System', tech: 'MERN Stack', description: 'Built a comprehensive ERP system mirroring real-world university portals with attendance and fee management.' },
      { title: 'Weather Application', tech: 'React, OpenWeather API', description: 'Real-time weather tracking application with geolocation.' }
    ]
  });

  const handleChange = (e) => {
    setResumeData({ ...resumeData, [e.target.name]: e.target.value });
  };

  const generatePDF = () => {
    toast.success('Generating Resume PDF...');
    
    // Create new PDF instance
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    let y = 20;

    // Helper formatting functions
    const centerText = (text, yPos, size, isBold = false) => {
      doc.setFontSize(size);
      doc.setFont("helvetica", isBold ? "bold" : "normal");
      const textWidth = doc.getTextWidth(text);
      doc.text(text, (pageWidth - textWidth) / 2, yPos);
    };

    // Header
    centerText(resumeData.name.toUpperCase(), y, 22, true);
    y += 8;
    centerText(`${resumeData.email} | ${resumeData.phone} | ${resumeData.address}`, y, 10);
    y += 10;
    
    // Divider
    doc.setDrawColor(0);
    doc.line(20, y, pageWidth - 20, y);
    y += 10;

    // Professional Objective
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("OBJECTIVE", 20, y);
    y += 6;
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    const splitObj = doc.splitTextToSize(resumeData.objective, pageWidth - 40);
    doc.text(splitObj, 20, y);
    y += (splitObj.length * 5) + 8;

    // Education
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("EDUCATION", 20, y);
    doc.line(20, y + 2, pageWidth - 20, y + 2);
    y += 8;

    resumeData.education.forEach(edu => {
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.text(edu.institution, 20, y);
      doc.setFont("helvetica", "normal");
      doc.text(edu.year, pageWidth - 20 - doc.getTextWidth(edu.year), y);
      y += 5;
      doc.text(`${edu.degree} | Score/CGPA: ${edu.cgpa}`, 20, y);
      y += 8;
    });

    // Skills
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("TECHNICAL SKILLS", 20, y);
    doc.line(20, y + 2, pageWidth - 20, y + 2);
    y += 8;
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    const splitSkills = doc.splitTextToSize(resumeData.skills, pageWidth - 40);
    doc.text(splitSkills, 20, y);
    y += (splitSkills.length * 5) + 8;

    // Experience
    if (resumeData.experience.length > 0) {
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("EXPERIENCE", 20, y);
      doc.line(20, y + 2, pageWidth - 20, y + 2);
      y += 8;

      resumeData.experience.forEach(exp => {
        doc.setFontSize(11);
        doc.setFont("helvetica", "bold");
        doc.text(exp.role, 20, y);
        doc.setFont("helvetica", "normal");
        doc.text(exp.company, 20, y + 5);
        doc.text(exp.duration, pageWidth - 20 - doc.getTextWidth(exp.duration), y);
        y += 10;
        doc.setFontSize(10);
        const splitDesc = doc.splitTextToSize(`• ${exp.description}`, pageWidth - 40);
        doc.text(splitDesc, 20, y);
        y += (splitDesc.length * 5) + 6;
      });
    }

    // Projects
    if (resumeData.projects.length > 0) {
      // Check page break
      if (y > 250) { doc.addPage(); y = 20; }
      
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("PROJECTS", 20, y);
      doc.line(20, y + 2, pageWidth - 20, y + 2);
      y += 8;

      resumeData.projects.forEach(proj => {
        doc.setFontSize(11);
        doc.setFont("helvetica", "bold");
        doc.text(`${proj.title} | ${proj.tech}`, 20, y);
        y += 5;
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        const splitDesc = doc.splitTextToSize(`• ${proj.description}`, pageWidth - 40);
        doc.text(splitDesc, 20, y);
        y += (splitDesc.length * 5) + 6;
      });
    }

    doc.save(`${resumeData.name.replace(/\s+/g, '_')}_Resume.pdf`);
  };

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <Link to="/placements" className="text-muted-foreground hover:text-primary flex items-center gap-2 mb-2 w-fit font-medium transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Placements
          </Link>
          <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <FileText className="w-8 h-8 text-primary" />
            Resume Builder
          </h1>
          <p className="text-muted-foreground mt-1 text-lg">Generate a professional PDF resume instantly for campus placements.</p>
        </div>
        <button 
          onClick={generatePDF}
          className="flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors font-bold shadow-lg"
        >
          <Download className="w-5 h-5" /> Download PDF
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Editor Form */}
        <div className="bg-background rounded-2xl border border-border p-6 shadow-sm space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
          
          <div className="space-y-4">
             <h2 className="text-xl font-bold border-b pb-2">Personal Details</h2>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div>
                 <label className="block text-sm font-bold text-muted-foreground mb-1">Full Name</label>
                 <input type="text" name="name" value={resumeData.name} onChange={handleChange} className="w-full bg-muted/50 border border-border rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary focus:border-transparent outline-none" />
               </div>
               <div>
                 <label className="block text-sm font-bold text-muted-foreground mb-1">Email ID</label>
                 <input type="email" name="email" value={resumeData.email} onChange={handleChange} className="w-full bg-muted/50 border border-border rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary focus:border-transparent outline-none" />
               </div>
               <div>
                 <label className="block text-sm font-bold text-muted-foreground mb-1">Phone Number</label>
                 <input type="text" name="phone" value={resumeData.phone} onChange={handleChange} className="w-full bg-muted/50 border border-border rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary focus:border-transparent outline-none" />
               </div>
               <div>
                 <label className="block text-sm font-bold text-muted-foreground mb-1">Location</label>
                 <input type="text" name="address" value={resumeData.address} onChange={handleChange} className="w-full bg-muted/50 border border-border rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary focus:border-transparent outline-none" />
               </div>
             </div>
          </div>

          <div className="space-y-4">
             <h2 className="text-xl font-bold border-b pb-2">Professional Objective</h2>
             <textarea rows="3" name="objective" value={resumeData.objective} onChange={handleChange} className="w-full bg-muted/50 border border-border rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary focus:border-transparent outline-none resize-none"></textarea>
          </div>

          <div className="space-y-4">
             <h2 className="text-xl font-bold border-b pb-2">Key Skills (Comma Separated)</h2>
             <textarea rows="2" name="skills" value={resumeData.skills} onChange={handleChange} className="w-full bg-muted/50 border border-border rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary focus:border-transparent outline-none resize-none"></textarea>
          </div>

          <div className="bg-blue-500/10 border border-blue-500/20 text-blue-600 rounded-lg p-4 text-sm font-medium">
             <p>💡 Tip: Ensure your data is fully updated before clicking "Download PDF". For additional project/experience entries, edit the code directly mapping to state. (Mock builder mode active)</p>
          </div>

        </div>

        {/* Live Preview Pane */}
        <div className="bg-slate-200/50 dark:bg-slate-900 rounded-2xl border border-border flex flex-col p-8 items-center justify-start min-h-[500px]">
           
           {/* Preview Sheet */}
           <div className="w-full max-w-[500px] bg-white text-slate-900 shadow-xl rounded p-8 aspect-[1/1.4] overflow-hidden rotate-0 transition-transform origin-top text-left pointer-events-none">
              
              <div className="text-center mb-6">
                 <h1 className="text-2xl font-black uppercase tracking-wider mb-1 text-slate-800">{resumeData.name}</h1>
                 <p className="text-[10px] text-slate-600">{resumeData.email} • {resumeData.phone} • {resumeData.address}</p>
              </div>

              <div className="mb-4">
                 <h2 className="text-[11px] font-bold border-b border-slate-300 pb-1 mb-2 uppercase text-slate-800">Objective</h2>
                 <p className="text-[10px] text-slate-600 leading-relaxed">{resumeData.objective}</p>
              </div>

              <div className="mb-4">
                 <h2 className="text-[11px] font-bold border-b border-slate-300 pb-1 mb-2 uppercase text-slate-800">Education</h2>
                 {resumeData.education.map((edu, i) => (
                   <div key={i} className="mb-2">
                     <div className="flex justify-between text-[10px] font-bold">
                       <span>{edu.institution}</span>
                       <span>{edu.year}</span>
                     </div>
                     <p className="text-[9px] text-slate-600">{edu.degree} | Score: {edu.cgpa}</p>
                   </div>
                 ))}
              </div>

              <div className="mb-4">
                 <h2 className="text-[11px] font-bold border-b border-slate-300 pb-1 mb-2 uppercase text-slate-800">Skills</h2>
                 <p className="text-[10px] text-slate-600 leading-relaxed">{resumeData.skills}</p>
              </div>

              <div className="mb-4">
                 <h2 className="text-[11px] font-bold border-b border-slate-300 pb-1 mb-2 uppercase text-slate-800">Experience</h2>
                 {resumeData.experience.map((exp, i) => (
                   <div key={i} className="mb-2">
                     <div className="flex justify-between text-[10px] font-bold">
                       <span>{exp.role}</span>
                       <span>{exp.duration}</span>
                     </div>
                     <p className="text-[9px] font-medium text-slate-700">{exp.company}</p>
                     <p className="text-[9px] text-slate-600 mt-0.5">• {exp.description}</p>
                   </div>
                 ))}
              </div>

           </div>
           {/* End Preview Sheet */}
           
        </div>
      </div>
    </div>
  );
}
