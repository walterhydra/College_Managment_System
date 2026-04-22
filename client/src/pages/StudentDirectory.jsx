import React, { useState, useEffect } from 'react';
import { Search, UserCheck, X, Users, Download } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function StudentDirectory() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [loading, setLoading] = useState(false);

  // Auto-search or fetch all students on mount
  useEffect(() => {
    handleSearch({ target: { value: '' } }); // Fetch initial list
  }, []);

  const handleSearch = async (e) => {
    const query = e?.target?.value !== undefined ? e.target.value : searchQuery;
    if (e && e.target) {
      setSearchQuery(query);
    }
    
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/admin/users/search?q=${query}`, {
        credentials: 'include'
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || 'Failed to fetch students');
      }
      const data = await res.json();
      setSearchResults(data);
    } catch (err) {
      toast.error('Search failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      window.open(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/admin/export-users`, '_blank');
    } catch (err) {
      toast.error('Export failed');
    }
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in zoom-in-95 duration-500 relative">
      
      {/* Student Details Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-background border border-border rounded-xl shadow-xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-5 border-b border-border flex justify-between items-center bg-muted/20">
              <h2 className="text-xl font-bold flex items-center gap-2"><UserCheck className="text-primary" /> Student Details</h2>
              <button onClick={() => setSelectedStudent(null)} className="text-muted-foreground hover:text-foreground">
                <X size={24} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center font-bold text-2xl uppercase">
                  {selectedStudent.firstName?.[0] || selectedStudent.email?.[0] || 'S'}
                </div>
                <div>
                  <h3 className="text-2xl font-bold">{selectedStudent.firstName} {selectedStudent.lastName}</h3>
                  <p className="text-muted-foreground">{selectedStudent.email}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="p-3 bg-muted/30 rounded-lg">
                  <p className="text-xs text-muted-foreground uppercase font-bold mb-1">Enrollment No</p>
                  <p className="font-medium">{selectedStudent.enrollmentNo || 'N/A'}</p>
                </div>
                <div className="p-3 bg-muted/30 rounded-lg">
                  <p className="text-xs text-muted-foreground uppercase font-bold mb-1">Department</p>
                  <p className="font-medium">{selectedStudent.department || 'N/A'}</p>
                </div>
                <div className="p-3 bg-muted/30 rounded-lg">
                  <p className="text-xs text-muted-foreground uppercase font-bold mb-1">Account Status</p>
                  <p className="font-medium">
                    <span className={`text-xs px-2 py-1 rounded font-medium ${selectedStudent.status === 'Active' ? 'bg-green-500/10 text-green-600' : 'bg-red-500/10 text-red-600'}`}>
                      {selectedStudent.status}
                    </span>
                  </p>
                </div>
                <div className="p-3 bg-muted/30 rounded-lg">
                  <p className="text-xs text-muted-foreground uppercase font-bold mb-1">User ID</p>
                  <p className="font-medium text-xs font-mono break-all">{selectedStudent._id}</p>
                </div>
              </div>
            </div>
            <div className="p-4 border-t border-border bg-muted/10 flex justify-end">
              <button 
                onClick={() => setSelectedStudent(null)}
                className="px-4 py-2 border border-border bg-background rounded-lg text-sm font-medium hover:bg-muted"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Student Directory</h1>
          <p className="text-muted-foreground mt-1">Search, filter, and manage all student profiles across the university.</p>
        </div>
        <button 
          onClick={handleExport}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors shadow-sm"
        >
          <Download size={18} /> Export CSV
        </button>
      </div>

      <div className="bg-background border border-border rounded-xl shadow-sm overflow-hidden min-h-[500px] flex flex-col">
        <div className="p-5 border-b border-border bg-muted/20 flex flex-wrap gap-4 items-center justify-between">
          <div className="relative w-full md:w-96">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={handleSearch}
              placeholder="Search by name, ID, or department..." 
              className="pl-10 pr-4 py-3 border border-border rounded-lg text-sm focus:outline-none focus:border-primary bg-background w-full shadow-sm" 
            />
          </div>
        </div>
        
        <div className="flex-1 overflow-auto">
          {loading ? (
             <div className="p-8 text-center text-muted-foreground">Loading directory...</div>
          ) : searchResults.length > 0 ? (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-muted/30 border-b border-border text-sm text-muted-foreground">
                  <th className="p-4 font-medium">Student Name</th>
                  <th className="p-4 font-medium">Enrollment No</th>
                  <th className="p-4 font-medium">Department</th>
                  <th className="p-4 font-medium">Role</th>
                  <th className="p-4 font-medium text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {searchResults.map(res => (
                  <tr 
                    key={res._id} 
                    onClick={() => setSelectedStudent(res)}
                    className="hover:bg-muted/10 cursor-pointer transition-colors group"
                  >
                    <td className="p-4">
                      <div className="font-bold group-hover:text-primary transition-colors">{res.firstName} {res.lastName}</div>
                      <div className="text-xs text-muted-foreground">{res.email}</div>
                    </td>
                    <td className="p-4 font-medium">{res.enrollmentNo || '-'}</td>
                    <td className="p-4">{res.department || '-'}</td>
                    <td className="p-4 capitalize">{res.role}</td>
                    <td className="p-4 text-right">
                      <span className={`text-xs px-2 py-1 rounded font-medium ${res.status === 'Active' ? 'bg-green-500/10 text-green-600' : 'bg-red-500/10 text-red-600'}`}>
                        {res.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-12 text-center text-muted-foreground flex flex-col items-center justify-center">
              <Users size={48} className="mb-4 opacity-20" />
              <p className="text-lg font-medium text-foreground">No students found</p>
              <p>Try adjusting your search terms.</p>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
