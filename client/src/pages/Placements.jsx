import { useEffect, useState } from 'react';
import { Briefcase, Building2, MapPin, IndianRupee, Clock, CheckCircle2, XCircle, Search, FileText } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { Link } from 'react-router-dom';

export default function Placements() {
  const [placementData, setPlacementData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('drives'); // drives | tracking

  useEffect(() => {
    fetchPlacementData();
  }, []);

  const fetchPlacementData = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/advanced/placements`);
      if (response.ok) {
        const data = await response.json();
        setPlacementData(data);
      } else {
         throw new Error('Fallback to mock');
      }
    } catch (error) {
      setPlacementData({
        statistics: { eligibleDrives: 12, applied: 3, shortlisted: 1, offers: 1 },
        drives: [
          { id: 1, company: 'Google', role: 'Software Engineer', package: '24.00 LPA', location: 'Bangalore', deadline: '2023-11-20', status: 'Open' },
          { id: 2, company: 'Microsoft', role: 'SDE-1', package: '42.00 LPA', location: 'Hyderabad', deadline: '2023-10-15', status: 'Closed' },
          { id: 3, company: 'Amazon', role: 'AWS Cloud Support', package: '16.00 LPA', location: 'Pune', deadline: '2023-12-01', status: 'Open' },
          { id: 4, company: 'TCS Digital', role: 'Systems Engineer', package: '7.50 LPA', location: 'Pan India', deadline: '2023-11-25', status: 'Open' }
        ],
        applications: [
          { driveId: 2, company: 'Microsoft', role: 'SDE-1', appliedDate: '2023-10-10', status: 'Rejected' },
          { driveId: 5, company: 'Infosys', role: 'Specialist Programmer', appliedDate: '2023-09-20', status: 'Shortlisted' },
          { driveId: 6, company: 'Tech Mahindra', role: 'Full Stack Developer', appliedDate: '2023-08-15', status: 'Offered' }
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApply = (id) => {
    toast.success('Application submitted successfully!');
    // Update local state to mock application movement
    setPlacementData(prev => {
      const drive = prev.drives.find(d => d.id === id);
      return {
        ...prev,
        statistics: { ...prev.statistics, applied: prev.statistics.applied + 1 },
        applications: [
          { driveId: id, company: drive.company, role: drive.role, appliedDate: new Date().toISOString().split('T')[0], status: 'Applied' },
          ...prev.applications
        ]
      }
    });
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Offered': return 'text-green-600 bg-green-500/10 border-green-500/20';
      case 'Shortlisted': return 'text-yellow-600 bg-yellow-500/10 border-yellow-500/20';
      case 'Rejected': return 'text-red-500 bg-red-500/10 border-red-500/20';
      case 'Applied': return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
      default: return 'text-muted-foreground bg-muted border-border';
    }
  };

  if (loading) {
    return <div className="p-6 h-screen flex justify-center items-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>;
  }

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Briefcase className="w-8 h-8 text-primary" />
            Placement Cell
          </h1>
          <p className="text-muted-foreground mt-1 text-lg">Apply for campus drives and track your job applications.</p>
        </div>
        
        <Link 
          to="/resume-builder"
          className="flex items-center justify-center gap-2 bg-accent text-white px-5 py-2.5 rounded-lg hover:bg-accent/90 transition-colors font-medium shadow-md whitespace-nowrap"
        >
           <FileText className="w-5 h-5" />
           Resume Builder
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
         {[
           { label: 'Eligible Drives', val: placementData.statistics.eligibleDrives, color: 'text-primary' },
           { label: 'Applied', val: placementData.statistics.applied, color: 'text-blue-500' },
           { label: 'Shortlisted', val: placementData.statistics.shortlisted, color: 'text-yellow-600' },
           { label: 'Offers', val: placementData.statistics.offers, color: 'text-green-500' }
         ].map((stat, idx) => (
            <div key={idx} className="bg-background border border-border p-5 rounded-2xl shadow-sm flex flex-col justify-center items-center text-center">
              <h2 className={`text-4xl font-black mb-1 ${stat.color}`}>{stat.val}</h2>
              <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider">{stat.label}</p>
            </div>
         ))}
      </div>

      {/* Tabs Layout */}
      <div className="bg-background rounded-2xl border border-border shadow-sm overflow-hidden">
         <div className="flex border-b border-border">
           <button 
             onClick={() => setActiveTab('drives')}
             className={`flex-1 overflow-hidden py-4 text-center font-bold text-sm transition-colors border-b-2 ${activeTab === 'drives' ? 'border-primary text-primary bg-primary/5' : 'border-transparent text-muted-foreground hover:bg-muted/50'}`}
           >
             Campus Drives
           </button>
           <button 
             onClick={() => setActiveTab('tracking')}
             className={`flex-1 py-4 text-center font-bold text-sm transition-colors border-b-2 ${activeTab === 'tracking' ? 'border-primary text-primary bg-primary/5' : 'border-transparent text-muted-foreground hover:bg-muted/50'}`}
           >
             Application Tracking
           </button>
         </div>

         {/* Content View */}
         <div className="p-6 md:p-8 bg-slate-50/50 dark:bg-slate-900/50">
            {activeTab === 'drives' ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                 {placementData.drives.map(drive => {
                   const isApplied = placementData.applications.some(a => a.driveId === drive.id);
                   const isClosed = drive.status === 'Closed';

                   return (
                     <div key={drive.id} className="bg-background border border-border rounded-xl p-6 shadow-sm hover:border-primary/40 transition-all flex flex-col">
                       <div className="flex justify-between items-start mb-4">
                         <div className="flex items-center gap-3">
                           <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center border border-border shrink-0">
                             <Building2 className="w-6 h-6 text-muted-foreground" />
                           </div>
                           <div>
                             <h3 className="text-xl font-bold">{drive.company}</h3>
                             <p className="text-sm text-primary font-medium">{drive.role}</p>
                           </div>
                         </div>
                         <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${isClosed ? 'bg-muted text-muted-foreground' : 'bg-green-500/10 text-green-600 border-green-500/20'}`}>
                           {drive.status}
                         </span>
                       </div>

                       <div className="grid grid-cols-2 gap-y-3 mb-6">
                         <div className="flex items-center gap-2 text-sm">
                           <IndianRupee className="w-4 h-4 text-muted-foreground" />
                           <span className="font-bold">{drive.package}</span>
                         </div>
                         <div className="flex items-center gap-2 text-sm text-muted-foreground">
                           <MapPin className="w-4 h-4" />
                           <span>{drive.location}</span>
                         </div>
                         <div className="col-span-2 flex items-center gap-2 text-sm text-amber-600 font-medium">
                           <Clock className="w-4 h-4" />
                           <span>Deadline: {new Date(drive.deadline).toLocaleDateString()}</span>
                         </div>
                       </div>

                       <div className="mt-auto pt-4 border-t border-border">
                         {isApplied ? (
                           <button disabled className="w-full bg-muted text-muted-foreground font-bold py-2.5 rounded-lg flex items-center justify-center gap-2">
                             <CheckCircle2 className="w-5 h-5" /> Already Applied
                           </button>
                         ) : isClosed ? (
                           <button disabled className="w-full bg-slate-100 dark:bg-slate-800 text-muted-foreground font-bold py-2.5 rounded-lg flex items-center justify-center gap-2 opacity-50">
                             <XCircle className="w-5 h-5" /> Registration Closed
                           </button>
                         ) : (
                           <button onClick={() => handleApply(drive.id)} className="w-full bg-primary text-primary-foreground font-bold py-2.5 rounded-lg hover:bg-primary/90 transition-colors shadow-sm">
                             Apply Now
                           </button>
                         )}
                       </div>
                     </div>
                   );
                 })}
              </div>
            ) : (
              <div className="overflow-x-auto bg-background rounded-xl border border-border">
                 <table className="w-full text-left border-collapse min-w-[700px]">
                    <thead>
                      <tr className="bg-muted/30 border-b border-border">
                        <th className="p-4 text-sm font-bold text-muted-foreground">Company</th>
                        <th className="p-4 text-sm font-bold text-muted-foreground">Role Applied</th>
                        <th className="p-4 text-sm font-bold text-muted-foreground">Date Applied</th>
                        <th className="p-4 text-sm font-bold text-muted-foreground text-right">Current Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {placementData.applications.map((app, idx) => (
                        <tr key={idx} className="hover:bg-muted/20 transition-colors">
                          <td className="p-4 font-bold flex items-center gap-3">
                             <div className="w-8 h-8 rounded bg-muted flex flex-shrink-0 items-center justify-center border">
                               <Building2 className="w-4 h-4 text-muted-foreground" />
                             </div>
                             {app.company}
                          </td>
                          <td className="p-4 text-sm font-medium">{app.role}</td>
                          <td className="p-4 text-sm text-muted-foreground">{new Date(app.appliedDate).toLocaleDateString()}</td>
                          <td className="p-4 text-right">
                             <span className={`inline-block px-3 py-1 rounded-full font-bold text-xs border ${getStatusStyle(app.status)}`}>
                               {app.status}
                             </span>
                          </td>
                        </tr>
                      ))}
                      {placementData.applications.length === 0 && (
                        <tr>
                          <td colSpan="4" className="p-8 text-center text-muted-foreground">
                            You haven't applied to any drives yet.
                          </td>
                        </tr>
                      )}
                    </tbody>
                 </table>
              </div>
            )}
         </div>
      </div>
    </div>
  );
}
