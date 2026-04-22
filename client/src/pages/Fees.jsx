import { useEffect, useState } from 'react';
import { IndianRupee, FileText, CheckCircle2, AlertCircle, Clock, Download } from 'lucide-react';
import { toast } from 'react-hot-toast';
import jsPDF from 'jspdf';
import { useAuth } from '../context/AuthContext';

export default function Fees() {
  const { user } = useAuth();
  const [feeData, setFeeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);

  useEffect(() => {
    fetchFeeData();
  }, []);

  const fetchFeeData = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/facilities/fees`);
      if (response.ok) {
        const data = await response.json();
        setFeeData(data);
      } else {
        throw new Error('Failed to fetch fee data');
      }
    } catch (error) {
      // Fallback
      setFeeData({
        summary: { totalFees: 120000, paidFees: 60000, dueFees: 60000, dueDate: '2023-11-30' },
        history: [{ id: 'TXN10293847', date: '2023-08-15', amount: 60000, semester: 'Odd Semester 2023', mode: 'Razorpay', status: 'SUCCESS' }],
        breakdown: [
          { item: 'Tuition Fee', amount: 90000 },
          { item: 'Development Fee', amount: 15000 },
          { item: 'Exam Fee', amount: 5000 },
          { item: 'Library Fee', amount: 5000 },
          { item: 'Activity Fee', amount: 5000 }
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    setPaying(true);
    
    // Simulate Razorpay popup delay
    setTimeout(async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/facilities/fees/pay`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ amount: feeData.summary.dueFees })
        });
        
        if (response.ok) {
          toast.success('Payment Successful!');
          const resData = await response.json();
          // Update local state to reflect payment
          setFeeData(prev => ({
            ...prev,
            summary: { ...prev.summary, paidFees: prev.summary.totalFees, dueFees: 0 },
            history: [
              {
                id: resData.transactionId,
                date: resData.date,
                amount: resData.amount,
                semester: 'Odd Semester 2023',
                mode: 'Razorpay',
                status: 'SUCCESS'
              },
              ...prev.history
            ]
          }));
        } else {
           throw new Error('Payment Failed');
        }
      } catch (error) {
        toast.success('Mock Payment Successful!'); // Fallback to success for demo
        setFeeData(prev => ({
            ...prev,
            summary: { ...prev.summary, paidFees: prev.summary.totalFees, dueFees: 0 },
            history: [
              {
                id: `TXN${Math.floor(Math.random() * 100000000)}`,
                date: new Date().toISOString(),
                amount: prev.summary.dueFees,
                semester: 'Odd Semester 2023',
                mode: 'Razorpay Mock',
                status: 'SUCCESS'
              },
              ...prev.history
            ]
        }));
      } finally {
        setPaying(false);
      }
    }, 1500);
  };

  const generateReceipt = (txn) => {
    const doc = new jsPDF();
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.setTextColor(26, 35, 53); // Navy
    doc.text("PARUL UNIVERSITY", 105, 20, { align: "center" });
    
    doc.setFontSize(14);
    doc.setTextColor(0, 180, 166); // Teal
    doc.text("FEE RECEIPT", 105, 30, { align: "center" });
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);
    doc.text(`Transaction ID: ${txn.id}`, 20, 50);
    doc.text(`Date: ${new Date(txn.date).toLocaleDateString()}`, 20, 60);
    doc.text(`Student Name: ${user?.profile?.firstName || 'Student'} ${user?.profile?.lastName || ''}`, 20, 70);
    doc.text(`Enrollment No: ${user?.profile?.enrollmentNo || '190410101010'}`, 20, 80);
    
    doc.setLineWidth(0.5);
    doc.line(20, 90, 190, 90);
    
    doc.setFont("helvetica", "bold");
    doc.text("Description", 20, 100);
    doc.text("Amount (INR)", 160, 100);
    
    doc.line(20, 105, 190, 105);
    
    doc.setFont("helvetica", "normal");
    doc.text(`Semester Fee - ${txn.semester}`, 20, 115);
    doc.text(`${txn.amount.toLocaleString()}`, 160, 115);
    
    doc.line(20, 130, 190, 130);
    doc.setFont("helvetica", "bold");
    doc.text("TOTAL PAID:", 120, 140);
    doc.text(`Rs. ${txn.amount.toLocaleString()}`, 160, 140);
    
    doc.setFont("helvetica", "italic");
    doc.setFontSize(9);
    doc.text('This is a computer-generated document and does not require a signature.', 105, 280, { align: "center" });

    doc.save(`Receipt_${txn.id}.pdf`);
  };

  if (loading) {
    return <div className="p-6 h-screen flex justify-center items-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>;
  }

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
          <IndianRupee className="w-8 h-8 text-primary" />
          Fee & Finance Dashboard
        </h1>
        <p className="text-muted-foreground mt-1 text-lg">Manage your tuition fees, view breakdowns, and download receipts.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Fees Card */}
        <div className="bg-background rounded-2xl border border-border p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
             <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                <FileText className="w-5 h-5 text-blue-500" />
             </div>
             <h3 className="font-semibold text-muted-foreground">Total Fees</h3>
          </div>
          <p className="text-3xl font-black mt-4 pl-1 flex items-center">
             <IndianRupee className="w-6 h-6 mr-1" />
             {feeData.summary.totalFees.toLocaleString()}
          </p>
        </div>

        {/* Paid Fees Card */}
        <div className="bg-background rounded-2xl border border-border p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
             <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
             </div>
             <h3 className="font-semibold text-muted-foreground">Paid Fees</h3>
          </div>
          <p className="text-3xl font-black mt-4 pl-1 text-green-500 flex items-center">
             <IndianRupee className="w-6 h-6 mr-1" />
             {feeData.summary.paidFees.toLocaleString()}
          </p>
        </div>

        {/* Due Fees Card */}
        <div className="bg-background rounded-2xl border border-border p-6 shadow-sm relative overflow-hidden">
          <div className="flex items-center gap-3 mb-2 relative z-10">
             <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-red-500" />
             </div>
             <h3 className="font-semibold text-muted-foreground">Pending Dues</h3>
          </div>
          <p className="text-3xl font-black mt-4 pl-1 text-red-500 flex items-center relative z-10">
             <IndianRupee className="w-6 h-6 mr-1" />
             {feeData.summary.dueFees.toLocaleString()}
          </p>
          {feeData.summary.dueFees > 0 && (
             <div className="absolute -bottom-2 -right-2 bg-red-500 text-white text-[10px] font-bold px-3 py-1.5 rounded-tl-lg flex items-center gap-1 opacity-80">
               <Clock className="w-3 h-3" /> Due: {feeData.summary.dueDate}
             </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Payment & Breakdown Section */}
        <div className="space-y-6">
           <div className="bg-background rounded-2xl border border-border p-6 shadow-sm">
             <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
               Fee Breakdown
             </h2>
             <div className="space-y-3">
               {feeData.breakdown.map((item, idx) => (
                 <div key={idx} className="flex justify-between items-center py-2 border-b border-border last:border-0">
                   <span className="text-muted-foreground">{item.item}</span>
                   <span className="font-bold">₹ {item.amount.toLocaleString()}</span>
                 </div>
               ))}
               <div className="flex justify-between items-center pt-4 mt-2 border-t-2 border-border font-black text-lg">
                 <span>Total Net Fee</span>
                 <span>₹ {feeData.summary.totalFees.toLocaleString()}</span>
               </div>
             </div>
             
             {feeData.summary.dueFees > 0 ? (
               <button 
                 onClick={handlePayment}
                 disabled={paying}
                 className="mt-8 w-full bg-primary text-primary-foreground font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 hover:bg-primary/90 transition-all shadow-md active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
               >
                 {paying ? (
                   <span className="flex items-center gap-2"><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> Processing Secure Payment...</span>
                 ) : (
                   <span className="flex items-center gap-2">Pay Outstanding ₹{feeData.summary.dueFees.toLocaleString()} Now</span>
                 )}
               </button>
             ) : (
               <div className="mt-8 w-full bg-green-500/10 text-green-600 font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 border border-green-500/20">
                 <CheckCircle2 className="w-5 h-5" />
                 All dues cleared for this semester
               </div>
             )}
           </div>
        </div>

        {/* Payment History */}
        <div className="space-y-6">
           <div className="bg-background rounded-2xl border border-border p-6 shadow-sm h-full">
             <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
               Transaction History
             </h2>
             
             {feeData.history.length === 0 ? (
               <div className="text-center py-10 text-muted-foreground">
                 <FileText className="w-12 h-12 mx-auto mb-3 opacity-20" />
                 <p>No transaction history found.</p>
               </div>
             ) : (
               <div className="space-y-4">
                 {feeData.history.map((txn, idx) => (
                   <div key={idx} className="border border-border rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-muted/30 transition-colors group">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] bg-green-500/10 text-green-500 px-2 py-0.5 rounded font-bold uppercase tracking-wider border border-green-500/20">
                            {txn.status}
                          </span>
                          <span className="text-xs text-muted-foreground font-medium">{txn.mode}</span>
                        </div>
                        <h4 className="font-bold text-lg">₹ {txn.amount.toLocaleString()}</h4>
                        <p className="text-xs text-muted-foreground mt-1">Txn ID: {txn.id}</p>
                        <p className="text-xs text-muted-foreground">{new Date(txn.date).toLocaleDateString()}</p>
                      </div>
                      
                      <button 
                        onClick={() => generateReceipt(txn)}
                        className="flex items-center justify-center gap-2 bg-background border border-border hover:bg-muted px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap"
                      >
                        <Download className="w-4 h-4 text-primary" />
                        Receipt
                      </button>
                   </div>
                 ))}
               </div>
             )}
           </div>
        </div>
      </div>
    </div>
  );
}
