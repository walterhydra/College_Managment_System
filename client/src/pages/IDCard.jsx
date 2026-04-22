import { useRef, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { QRCodeSVG } from 'qrcode.react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { Download, ArrowLeft, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';

export default function IDCard() {
  const { user } = useAuth();
  const cardRef = useRef(null);
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    try {
      setDownloading(true);
      const canvas = await html2canvas(cardRef.current, {
        scale: 3, // High quality
        useCORS: true,
        backgroundColor: null
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: [54, 85.6] // CR80 standard ID card size (Credit Card Size)
      });

      pdf.addImage(imgData, 'PNG', 0, 0, 54, 85.6);
      pdf.save(`ID-Card-${user?.profile?.enrollmentNo || 'ERP'}.pdf`);
      toast.success('ID Card Downloaded successfully!');
    } catch (error) {
      toast.error('Failed to generate PDF');
      console.error(error);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/" className="p-2 bg-muted hover:bg-muted/80 rounded-full transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Digital ID Card</h1>
            <p className="text-muted-foreground mt-1">View and download your official university identification.</p>
          </div>
        </div>
        
        <button 
          onClick={handleDownload}
          disabled={downloading}
          className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg font-bold shadow-md hover:bg-primary/90 transition-colors disabled:opacity-50"
        >
          {downloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
          {downloading ? 'Generating PDF...' : 'Download PDF'}
        </button>
      </div>

      <div className="flex justify-center mt-12">
        {/* Physical Card Wrapper for rendering */}
        {/* We use specific px dimensions so html2canvas renders it perfectly to match proportions */}
        <div 
          ref={cardRef} 
          className="relative bg-white rounded-xl overflow-hidden shadow-2xl flex flex-col"
          style={{ width: '340px', height: '540px' }} // Standard portrait proportions mostly
        >
          {/* Header Banner - Parul Aesthetic */}
          <div className="h-28 bg-[#1a2335] w-full flex flex-col items-center justify-center relative">
            <div className="text-white text-xl font-black tracking-widest uppercase">
              PARUL UNIVERSITY
            </div>
            <div className="text-[#00b4a6] text-xs font-semibold tracking-widest mt-1">
              VADODARA, GUJARAT
            </div>
            <div className="absolute -bottom-3 w-full border-b-[6px] border-[#e53935]" />
          </div>

          <div className="flex-1 flex flex-col items-center px-6 pt-10 pb-6 text-slate-900">
            {/* Profile Photo */}
            <div className="w-32 h-32 rounded-full border-4 border-white shadow-lg overflow-hidden absolute top-14 bg-slate-200">
               <img 
                 src={user?.profile?.profilePhoto || 'https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg'} 
                 alt="Profile" 
                 className="w-full h-full object-cover"
                 crossOrigin="anonymous"
               />
            </div>

            <div className="mt-14 w-full text-center">
              <h2 className="text-2xl font-black text-[#1a2335] uppercase">{user?.profile?.firstName} {user?.profile?.lastName}</h2>
              <p className="text-sm font-semibold text-[#e53935] uppercase tracking-wide mt-1">{user?.profile?.program || 'STUDENT'}</p>
            </div>

            <div className="w-full mt-6 space-y-3">
              <div className="flex justify-between border-b border-slate-200 pb-1">
                <span className="text-xs font-bold text-slate-400 uppercase">Enrollment No</span>
                <span className="text-sm font-bold text-[#1a2335]">{user?.profile?.enrollmentNo || 'N/A'}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-1">
                <span className="text-xs font-bold text-slate-400 uppercase">D.O.B</span>
                <span className="text-sm font-bold text-[#1a2335]">
                  {user?.profile?.dob ? new Date(user.profile.dob).toLocaleDateString() : 'N/A'}
                </span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-1">
                <span className="text-xs font-bold text-slate-400 uppercase">Blood Group</span>
                <span className="text-sm font-bold text-[#e53935]">{user?.profile?.bloodGroup || 'N/A'}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-1">
                <span className="text-xs font-bold text-slate-400 uppercase">Valid Till</span>
                <span className="text-sm font-bold text-[#1a2335]">MAY 2025</span>
              </div>
            </div>

            <div className="mt-auto flex justify-between items-end w-full pt-4">
              <div className="p-1 bg-white inline-block">
                 {/* Provide robust string for QR code generation */}
                 <QRCodeSVG 
                    value={`PU-${user?.profile?.enrollmentNo || user?._id}`} 
                    size={60} 
                  />
              </div>
              
              <div className="text-right flex flex-col items-center pb-2">
                <img 
                  src="https://upload.wikimedia.org/wikipedia/commons/d/d4/Signature_of_dummy.svg" 
                  alt="Auth Signature" 
                  style={{ filter: "opacity(0.6) grayscale(1)" }} 
                  className="w-16 h-8 object-contain Mix-blend-multiply" 
                  crossOrigin="anonymous" 
                />
                <span className="text-[10px] font-bold text-slate-500 uppercase mt-1">Registrar</span>
              </div>
            </div>

          </div>

          <div className="h-3 w-full bg-[#1a2335]" />
        </div>
      </div>
      
      <p className="text-center text-sm text-muted-foreground">
        Present this digital ID card at campus entry gates or to university officials upon request.
      </p>
    </div>
  );
}
