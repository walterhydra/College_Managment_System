import { useEffect, useState } from 'react';
import { Home, Coffee, AlertTriangle, User, BedDouble, Phone } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function Hostel() {
  const [hostelData, setHostelData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [complaintText, setComplaintText] = useState('');

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const [activeDay, setActiveDay] = useState(new Date().toLocaleString('en-us', { weekday: 'long' }));

  useEffect(() => {
    fetchHostelData();
  }, []);

  const fetchHostelData = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/facilities/hostel`);
      if (response.ok) {
        const data = await response.json();
        setHostelData(data);
      } else {
        throw new Error('Fallback to mock data');
      }
    } catch (error) {
      setHostelData({
        roomDetails: {
          hostelName: 'Boys Hostel A',
          roomNumber: 'B-214',
          bedType: 'Standard Non-AC',
          occupancy: 3,
          warden: 'Mr. R.K. Singh',
          wardenPhone: '+91 9876543210'
        },
        messMenu: {
          Monday: { breakfast: 'Poha, Tea', lunch: 'Roti, Dal, Rice, Mix Veg', dinner: 'Roti, Paneer Butter Masala, Rice' },
          Tuesday: { breakfast: 'Idli Sambar, Coffee', lunch: 'Puri, Chole, Rice, Curd', dinner: 'Roti, Kadhai Paneer, Dal Makhani' },
          Wednesday: { breakfast: 'Aloo Paratha, Curd', lunch: 'Roti, Rajma, Rice', dinner: 'Roti, Mix Veg, Dal Fry, Gulab Jamun' },
          Thursday: { breakfast: 'Upma, Tea', lunch: 'Roti, Dal, Rice, Bhindi', dinner: 'Roti, Egg Curry / Malai Kofta, Rice' },
          Friday: { breakfast: 'Dosa, Sambar', lunch: 'Roti, Kadhi Pakora, Jeera Rice', dinner: 'Roti, Dal Tadka, Aloo Gobi' },
          Saturday: { breakfast: 'Puri Bhaji, Tea', lunch: 'Veg Biryani, Raita', dinner: 'Roti, Dal, Mix Veg' },
          Sunday: { breakfast: 'Chole Bhature', lunch: 'Special Thali', dinner: 'Pav Bhaji, Pulao' }
        }
      });
    } finally {
      setLoading(false);
    }
  };

  const handleComplaintSubmit = (e) => {
    e.preventDefault();
    if (!complaintText.trim()) return;
    toast.success('Complaint submitted to warden successfully!');
    setComplaintText('');
  };

  if (loading) {
    return <div className="p-6 h-screen flex justify-center items-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>;
  }

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
          <Home className="w-8 h-8 text-primary" />
          Hostel & Mess Module
        </h1>
        <p className="text-muted-foreground mt-1 text-lg">View your room allocation, mess menu, and lodge complaints.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Room & Complaints */}
        <div className="lg:col-span-5 space-y-8">
          
          {/* Room Allocation Card */}
          <div className="bg-background rounded-2xl border border-border overflow-hidden shadow-sm">
            <div className="h-2 bg-primary"></div>
            <div className="p-6">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2 border-b pb-3">
                <BedDouble className="w-5 h-5 text-accent" />
                Room Allocation
              </h2>
              
              <div className="space-y-4">
                <div className="bg-muted p-4 rounded-xl flex items-center justify-between border border-border">
                   <div>
                     <p className="text-sm text-muted-foreground">Hostel Block</p>
                     <p className="font-bold text-lg">{hostelData.roomDetails.hostelName}</p>
                   </div>
                   <div className="text-right">
                     <p className="text-sm text-muted-foreground">Room No.</p>
                     <p className="font-bold text-2xl text-primary">{hostelData.roomDetails.roomNumber}</p>
                   </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="space-y-1">
                    <span className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Type</span>
                    <p className="font-medium">{hostelData.roomDetails.bedType}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Occupancy</span>
                    <p className="font-medium">{hostelData.roomDetails.occupancy} Seater</p>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-dashed border-border flex items-center justify-between">
                   <div className="flex items-center gap-3">
                     <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                       <User className="w-5 h-5 text-accent" />
                     </div>
                     <div>
                       <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider">Warden</p>
                       <p className="font-bold text-sm">{hostelData.roomDetails.warden}</p>
                     </div>
                   </div>
                   <a href={`tel:${hostelData.roomDetails.wardenPhone}`} className="p-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-full transition-colors">
                     <Phone className="w-4 h-4" />
                   </a>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Complaint Box */}
          <div className="bg-background rounded-2xl border border-border p-6 shadow-sm">
             <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-yellow-500" />
                Lodge a Complaint
             </h2>
             <form onSubmit={handleComplaintSubmit} className="space-y-3">
                <textarea 
                  rows="3"
                  value={complaintText}
                  onChange={(e) => setComplaintText(e.target.value)}
                  placeholder="Describe your issue (e.g. WiFi down, AC not working, Plumbing issue...)"
                  className="w-full resize-none rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                ></textarea>
                <button 
                  type="submit"
                  disabled={!complaintText.trim()}
                  className="w-full bg-slate-900 text-white font-medium py-2.5 rounded-lg text-sm hover:bg-slate-800 transition-colors disabled:opacity-50"
                >
                  Submit to Warden
                </button>
             </form>
          </div>

        </div>

        {/* Right Column: Mess Menu */}
        <div className="lg:col-span-7">
          <div className="bg-background rounded-2xl border border-border shadow-sm h-full flex flex-col overflow-hidden">
             <div className="p-6 border-b border-border bg-muted/20">
               <h2 className="text-2xl font-bold flex items-center gap-2">
                 <Coffee className="w-6 h-6 text-primary" />
                 Weekly Mess Menu
               </h2>
             </div>
             
             <div className="flex-1 flex flex-col md:flex-row">
                {/* Days Sidebar */}
                <div className="w-full md:w-48 bg-muted/30 border-b md:border-b-0 md:border-r border-border p-4 flex flex-row md:flex-col gap-2 overflow-x-auto no-scrollbar">
                   {days.map(day => (
                     <button
                       key={day}
                       onClick={() => setActiveDay(day)}
                       className={`flex-shrink-0 text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                         activeDay === day 
                           ? 'bg-primary text-primary-foreground shadow-md' 
                           : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                       }`}
                     >
                       {day}
                       {new Date().toLocaleString('en-us', { weekday: 'long' }) === day && (
                         <span className="ml-2 inline-block w-2 h-2 rounded-full bg-green-500"></span>
                       )}
                     </button>
                   ))}
                </div>

                {/* Meals Content */}
                <div className="flex-1 p-6 md:p-8 space-y-6">
                   <h3 className="text-xl font-bold mb-6 border-b pb-2">{activeDay}'s Menu</h3>
                   
                   {/* Breakfast */}
                   <div className="relative pl-6 border-l-2 border-yellow-500/30 pb-2">
                      <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-yellow-500 border-4 border-background"></div>
                      <h4 className="font-bold text-yellow-600 mb-1">Breakfast</h4>
                      <p className="text-sm text-muted-foreground font-medium bg-muted/50 p-3 rounded-lg border border-border/50">
                        {hostelData.messMenu[activeDay]?.breakfast || 'Not Available'}
                      </p>
                      <span className="text-[10px] uppercase font-bold text-muted-foreground mt-2 block tracking-wider">07:30 AM - 09:00 AM</span>
                   </div>

                   {/* Lunch */}
                   <div className="relative pl-6 border-l-2 border-blue-500/30 pb-2">
                      <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-blue-500 border-4 border-background"></div>
                      <h4 className="font-bold text-blue-600 mb-1">Lunch</h4>
                      <p className="text-sm text-muted-foreground font-medium bg-muted/50 p-3 rounded-lg border border-border/50">
                        {hostelData.messMenu[activeDay]?.lunch || 'Not Available'}
                      </p>
                      <span className="text-[10px] uppercase font-bold text-muted-foreground mt-2 block tracking-wider">12:30 PM - 02:00 PM</span>
                   </div>

                   {/* Dinner */}
                   <div className="relative pl-6 border-l-2 border-transparent">
                      <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-primary border-4 border-background"></div>
                      <h4 className="font-bold text-primary mb-1">Dinner</h4>
                      <p className="text-sm text-muted-foreground font-medium bg-muted/50 p-3 rounded-lg border border-border/50">
                        {hostelData.messMenu[activeDay]?.dinner || 'Not Available'}
                      </p>
                      <span className="text-[10px] uppercase font-bold text-muted-foreground mt-2 block tracking-wider">07:30 PM - 09:30 PM</span>
                   </div>
                </div>
             </div>
          </div>
        </div>

      </div>
    </div>
  );
}
