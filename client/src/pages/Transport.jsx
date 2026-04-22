import { useEffect, useState } from 'react';
import { Bus, MapPin, Search, Clock, Map, User, Phone, CheckCircle2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function Transport() {
  const [transportData, setTransportData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTransportData();
  }, []);

  const fetchTransportData = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/facilities/transport`);
      if (response.ok) {
        const data = await response.json();
        setTransportData(data);
      } else {
        throw new Error('Fallback to mock data');
      }
    } catch (error) {
      setTransportData({
        userRoute: {
          status: 'Active',
          routeName: 'Route 4 - City Center',
          pickupPoint: 'Main Square Clock Tower',
          pickupTime: '07:45 AM',
          dropTime: '05:15 PM',
          busNumber: 'GJ-06-XX-1234',
          driverName: 'Ramesh Bhai',
          driverPhone: '+91 9123456780'
        },
        availableRoutes: [
          { id: 1, name: 'Route 1 - North Zone', availableSeats: 5 },
          { id: 2, name: 'Route 2 - South Zone', availableSeats: 12 },
          { id: 3, name: 'Route 3 - East Zone', availableSeats: 0 },
          { id: 4, name: 'Route 4 - City Center', availableSeats: 8 }
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  const requestPass = () => {
    toast.success('Pass request submitted. Visit Transport office for ID verification.');
  };

  if (loading) {
    return <div className="p-6 h-screen flex justify-center items-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>;
  }

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
          <Bus className="w-8 h-8 text-primary" />
          Transport Facility
        </h1>
        <p className="text-muted-foreground mt-1 text-lg">Manage your bus pass and track your allotted route details.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Current Allotment */}
        <div className="space-y-6">
           <div className="bg-background rounded-2xl border border-border overflow-hidden shadow-sm">
              <div className="h-2 bg-accent"></div>
              <div className="p-6 sm:p-8">
                <div className="flex justify-between items-start mb-6 border-b pb-4">
                   <h2 className="text-2xl font-bold flex items-center gap-2">
                     <Map className="w-6 h-6 text-accent" />
                     Your Route
                   </h2>
                   <div className="bg-green-500/10 text-green-600 border border-green-500/20 px-3 py-1 rounded-full text-xs font-bold uppercase flex items-center gap-1 tracking-wider">
                     <CheckCircle2 className="w-3 h-3" />
                     Allotted
                   </div>
                </div>

                <div className="bg-muted p-5 rounded-xl border border-border mb-6">
                   <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-1">Route Info</p>
                   <h3 className="text-xl font-bold text-primary">{transportData.userRoute.routeName}</h3>
                   <div className="mt-4 flex flex-col sm:flex-row gap-4 sm:items-center text-sm font-medium">
                     <span className="flex items-center gap-1.5 bg-background px-3 py-1.5 rounded-md border border-border">
                       <MapPin className="w-4 h-4 text-red-500" />
                       {transportData.userRoute.pickupPoint}
                     </span>
                     <span className="flex items-center gap-1.5 bg-background px-3 py-1.5 rounded-md border border-border">
                       <Clock className="w-4 h-4 text-blue-500" />
                       Pickup: {transportData.userRoute.pickupTime}
                     </span>
                   </div>
                </div>

                <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                   <div>
                     <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider mb-1">Bus Number</p>
                     <p className="font-bold border w-fit px-2 py-1 rounded bg-muted font-mono">{transportData.userRoute.busNumber}</p>
                   </div>
                   <div>
                     <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider mb-1">Return Drop Time</p>
                     <p className="font-bold">{transportData.userRoute.dropTime}</p>
                   </div>
                   
                   <div className="col-span-2 pt-4 border-t border-dashed border-border mt-2">
                     <div className="flex items-center justify-between">
                       <div className="flex items-center gap-3">
                         <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                           <User className="w-5 h-5 text-accent" />
                         </div>
                         <div>
                           <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider">Driver Contact</p>
                           <p className="font-bold text-sm">{transportData.userRoute.driverName}</p>
                         </div>
                       </div>
                       <a href={`tel:${transportData.userRoute.driverPhone}`} className="px-4 py-2 bg-primary text-primary-foreground font-medium rounded-lg text-sm hover:bg-primary/90 transition-colors flex items-center gap-2">
                         <Phone className="w-4 h-4" />
                         Call Driver
                       </a>
                     </div>
                   </div>
                </div>
              </div>
           </div>
        </div>

        {/* Global Directory */}
        <div className="space-y-6">
           <div className="bg-background rounded-2xl border border-border p-6 sm:p-8 shadow-sm h-full">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                 <Search className="w-5 h-5 text-muted-foreground" />
                 Explore Routes
              </h2>
              
              <div className="space-y-3">
                {transportData.availableRoutes.map(route => (
                   <div key={route.id} className="border border-border p-4 rounded-xl flex items-center justify-between hover:border-primary/40 transition-colors">
                      <div className="font-bold flex items-center gap-2">
                         <Bus className="w-4 h-4 text-muted-foreground" />
                         {route.name}
                      </div>
                      <div>
                        {route.availableSeats > 0 ? (
                           <span className="text-xs font-bold text-green-600 bg-green-500/10 px-2 py-1 rounded border border-green-500/20">
                             {route.availableSeats} Seats Left
                           </span>
                        ) : (
                           <span className="text-xs font-bold text-red-600 bg-red-500/10 px-2 py-1 rounded border border-red-500/20">
                             Full
                           </span>
                        )}
                      </div>
                   </div>
                ))}
              </div>

              <div className="mt-8 pt-6 border-t border-border">
                 <h3 className="font-bold mb-2">Need to change your route?</h3>
                 <p className="text-sm text-muted-foreground mb-4">
                   Changes to transport allotment require administrative approval and are subject to seat availability.
                 </p>
                 <button 
                   onClick={requestPass}
                   className="w-full border-2 border-primary text-primary font-bold py-2.5 rounded-lg hover:bg-primary hover:text-white transition-colors"
                 >
                   Request Route Transfer
                 </button>
              </div>
           </div>
        </div>

      </div>
    </div>
  );
}
