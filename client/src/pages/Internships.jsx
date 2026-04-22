import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Briefcase, Building, FileCheck, ExternalLink, ShieldCheck, FileDown, Plus } from 'lucide-react';
import { toast } from 'react-hot-toast';
import axios from 'axios';

const Internships = () => {
  const { t } = useTranslation();
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showApplyModal, setShowApplyModal] = useState(false);

  useEffect(() => {
    fetchInternships();
  }, []);

  const fetchInternships = async () => {
    try {
      // Trying to fetch real integrations data
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      const response = await axios.get('/api/integrations/internships', config);
      setInternships(response.data.internships || []);
    } catch (error) {
       // Fallback mock
       setInternships([
        { id: '1', company: 'TechNova', role: 'Frontend Developer Intern', duration: '6 Months', status: 'Completed', creditsEarned: 2 },
        { id: '2', company: 'Global Solutions', role: 'UI/UX Design Intern', duration: '3 Months', status: 'Ongoing', creditsEarned: 0 }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const formData = new FormData(e.target);
    const payload = {
      companyName: formData.get('companyName'),
      role: formData.get('role'),
      duration: formData.get('duration')
    };

    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.post('/api/integrations/internships/apply', payload, config);
      toast.success('Internship application submitted successfully!');
      setShowApplyModal(false);
      fetchInternships(); // refresh
    } catch (error) {
      toast.error('Application failed. Please check network.');
      setShowApplyModal(false);
    }
  };

  const handleDownloadNOC = async (internshipId) => {
    toast.loading('Generating Secure Watermarked NOC...', { id: 'noc-toast' });
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      // Backend expects a POST request to generate the PDF based on the ID.
      const res = await axios.post('/api/integrations/internships/certificate', { internshipId }, config);
      
      toast.success(`NOC Verified: ${res.data.qrHash}`, { id: 'noc-toast' });
      // In production, trigger PDF Blob download mapping to res.data.downloadUrl
    } catch (error) {
       toast.error('Failed to generate secure NOC', { id: 'noc-toast' });
    }
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8 animate-fade-in pb-20">
      
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-navy dark:text-white flex items-center gap-2">
            <Building className="w-8 h-8 text-teal" />
            Internship Portal
          </h1>
          <p className="text-slate-500 mt-1 text-lg">Apply for internships, submit reports, and download verified NOCs.</p>
        </div>
        
        <button 
          onClick={() => setShowApplyModal(true)}
          className="flex items-center justify-center gap-2 bg-teal text-white px-5 py-2.5 rounded-lg hover:bg-teal-700 transition-colors font-medium shadow-md whitespace-nowrap"
        >
           <Plus className="w-5 h-5" />
           Register New Internship
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {internships.map((intern) => (
          <div key={intern.id} className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 flex flex-col shadow-sm relative overflow-hidden">
            {/* Status Ribbon */}
            <div className={`absolute top-0 right-0 px-4 py-1 rounded-bl-lg font-bold text-xs uppercase tracking-wider text-white ${intern.status === 'Completed' ? 'bg-green-500' : 'bg-amber-500'}`}>
               {intern.status}
            </div>

            <div className="flex items-start gap-4 mb-4 mt-2">
              <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center shrink-0">
                <Briefcase className="w-6 h-6 text-slate-500 dark:text-slate-400" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-navy dark:text-white leading-tight">{intern.company}</h3>
                <p className="text-teal font-medium mt-1">{intern.role}</p>
              </div>
            </div>

            <div className="space-y-2 mb-6">
               <div className="flex items-center justify-between text-sm">
                 <span className="text-slate-500">Duration</span>
                 <span className="font-medium text-slate-800 dark:text-slate-200">{intern.duration}</span>
               </div>
               <div className="flex items-center justify-between text-sm">
                 <span className="text-slate-500">Credits Earned</span>
                 <span className="font-bold text-slate-800 dark:text-slate-200">{intern.creditsEarned} Cr</span>
               </div>
            </div>

            <div className="mt-auto space-y-3 border-t border-slate-100 dark:border-slate-700 pt-4">
               {intern.status === 'Ongoing' && (
                  <button 
                    onClick={() => handleDownloadNOC(intern.id)}
                    className="w-full flex justify-center items-center gap-2 py-2.5 rounded-lg border border-teal text-teal hover:bg-teal hover:text-white transition-colors font-medium text-sm"
                  >
                     <ShieldCheck size={18} />
                     Generate NOC
                  </button>
               )}
               {intern.status === 'Completed' && (
                  <button 
                    className="w-full flex justify-center items-center gap-2 py-2.5 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-300 font-medium text-sm cursor-not-allowed"
                     disabled
                  >
                     <FileCheck size={18} />
                     Certificate Approved
                  </button>
               )}
            </div>
          </div>
        ))}

        {internships.length === 0 && !loading && (
           <div className="col-span-full py-12 text-center border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl">
             <Briefcase className="w-12 h-12 text-slate-400 mx-auto mb-3" />
             <h3 className="text-lg font-bold text-slate-600 dark:text-slate-300">No Internships Registered</h3>
             <p className="text-slate-500 mt-1">Register an active internship to begin tracking credits.</p>
           </div>
        )}
      </div>

      {/* Internal Modal (For Demo, typically abstracted) */}
      {showApplyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
           <form onSubmit={handleApply} className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl relative">
              <h2 className="text-2xl font-bold text-navy dark:text-white mb-2">Register Internship</h2>
              <p className="text-sm text-slate-500 mb-6">Enter details to generate an official NOC.</p>
              
              <div className="space-y-4">
                <div>
                   <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Company Name</label>
                   <input required name="companyName" type="text" className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-transparent" placeholder="e.g. Google India" />
                </div>
                <div>
                   <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Role / Profile</label>
                   <input required name="role" type="text" className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-transparent" placeholder="e.g. Software Engineering Intern" />
                </div>
                <div>
                   <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Duration</label>
                   <select required name="duration" className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-transparent text-slate-700 dark:text-slate-200">
                     <option value="1 Month">1 Month</option>
                     <option value="3 Months">3 Months</option>
                     <option value="6 Months">6 Months</option>
                   </select>
                </div>
              </div>

              <div className="flex gap-3 mt-8">
                 <button type="button" onClick={() => setShowApplyModal(false)} className="flex-1 py-2.5 rounded-lg border border-slate-300 text-slate-600 font-medium">Cancel</button>
                 <button type="submit" className="flex-1 py-2.5 rounded-lg bg-teal text-white font-medium hover:bg-teal-700">Submit</button>
              </div>
           </form>
        </div>
      )}

    </div>
  );
};

export default Internships;
