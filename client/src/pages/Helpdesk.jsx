import { useState, useEffect, useContext, useRef } from 'react';
import { AuthContext } from '../context/AuthContext';
import { MessageSquare, FileWarning, ScrollText, Send, User, ShieldAlert } from 'lucide-react';
import { io } from 'socket.io-client';
import { toast } from 'react-hot-toast';

export default function Helpdesk() {
  const { user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('chat'); // chat, grievance, certificates
  
  // Chat State
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([
    { senderId: 'admin', text: 'Welcome to the Student Helpdesk. How can we assist you today?', timestamp: new Date().toISOString() }
  ]);
  const [currentMessage, setCurrentMessage] = useState('');
  const messagesEndRef = useRef(null);

  // Forms State
  const [grievanceData, setGrievanceData] = useState({ type: '', subject: '', description: '' });
  const [certificateData, setCertificateData] = useState({ type: '',  reason: '' });

  // Initialize Socket Connection
  useEffect(() => {
    const newSocket = io(import.meta.env.VITE_API_URL || 'http://localhost:5000', {
      withCredentials: true
    });
    setSocket(newSocket);

    if (user?._id) {
      newSocket.emit('join_room', user._id);
    }

    newSocket.on('receive_message', (data) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => {
      newSocket.disconnect();
    };
  }, [user?._id]);

  // Auto-scroll chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (currentMessage.trim() !== '' && socket && user) {
      const messageData = {
        senderId: user._id,
        text: currentMessage,
        timestamp: new Date().toISOString()
      };
      
      // Emit to server
      socket.emit('send_message', messageData);
      setCurrentMessage('');
    }
  };

  const submitGrievance = (e) => {
    e.preventDefault();
    toast.success('Grievance submitted successfully. Ticket #HT-9021 generated.');
    setGrievanceData({ type: '', subject: '', description: '' });
  };

  const submitCertificate = (e) => {
    e.preventDefault();
    toast.success('Certificate request submitted. Processing takes 2-3 working days.');
    setCertificateData({ type: '', reason: '' });
  };

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8 h-[calc(100vh-4rem)] flex flex-col">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
          <MessageSquare className="w-8 h-8 text-primary" />
          Operations & Helpdesk
        </h1>
        <p className="text-muted-foreground mt-1 text-lg">Real-time faculty support, grievances, and certificate generation.</p>
      </div>

      <div className="flex-1 bg-background rounded-2xl border border-border shadow-sm flex flex-col md:flex-row overflow-hidden min-h-[500px]">
        {/* Sidebar Navigation */}
        <div className="md:w-64 border-b md:border-b-0 md:border-r border-border bg-muted/20 p-4 space-y-2 shrink-0">
          <button 
            onClick={() => setActiveTab('chat')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${activeTab === 'chat' ? 'bg-primary text-primary-foreground shadow-sm' : 'hover:bg-muted text-foreground'}`}
          >
            <MessageSquare className="w-5 h-5" /> Live Support
          </button>
          <button 
            onClick={() => setActiveTab('grievance')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${activeTab === 'grievance' ? 'bg-primary text-primary-foreground shadow-sm' : 'hover:bg-muted text-foreground'}`}
          >
            <FileWarning className="w-5 h-5" /> Grievance Cell
          </button>
          <button 
            onClick={() => setActiveTab('certificates')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${activeTab === 'certificates' ? 'bg-primary text-primary-foreground shadow-sm' : 'hover:bg-muted text-foreground'}`}
          >
            <ScrollText className="w-5 h-5" /> Certificates
          </button>
        </div>

        {/* Dynamic Content Pane */}
        <div className="flex-1 flex flex-col bg-background relative overflow-hidden">
          
          {/* Live Chat Tab */}
          {activeTab === 'chat' && (
            <>
              <div className="flex-1 p-6 overflow-y-auto space-y-4 custom-scrollbar">
                <div className="bg-blue-500/10 border border-blue-500/20 text-blue-600 rounded-lg p-3 text-sm flex items-center gap-2 mb-6">
                  <ShieldAlert className="w-5 h-5" />
                  <span>You are securely connected to the support socket. Responses generally take 1-2 minutes.</span>
                </div>

                {messages.map((msg, idx) => {
                  const isMe = msg.senderId === user?._id;
                  return (
                    <div key={idx} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                      <div className={`flex gap-3 max-w-[80%] ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                        <div className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center text-white ${isMe ? 'bg-teal' : 'bg-slate-700'}`}>
                          {isMe ? <User size={16} /> : 'A'}
                        </div>
                        <div className={`rounded-2xl px-5 py-3 ${isMe ? 'bg-primary text-primary-foreground rounded-tr-none' : 'bg-muted/50 rounded-tl-none border border-border'}`}>
                          <p className="text-sm">{msg.text}</p>
                          <p className={`text-[10px] mt-1 ${isMe ? 'text-primary-foreground/70 text-right' : 'text-muted-foreground'}`}>
                            {new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Chat Input */}
              <div className="p-4 border-t border-border bg-muted/10">
                <form onSubmit={sendMessage} className="flex gap-2">
                  <input
                    type="text"
                    value={currentMessage}
                    onChange={(e) => setCurrentMessage(e.target.value)}
                    placeholder="Type your message here..."
                    className="flex-1 bg-background border border-border rounded-lg px-4 py-2 focus:outline-none focus:border-primary transition-colors"
                  />
                  <button 
                    type="submit" 
                    disabled={!currentMessage.trim()}
                    className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center gap-2 font-medium"
                  >
                    Send <Send size={18} />
                  </button>
                </form>
              </div>
            </>
          )}

          {/* Grievance Tab */}
          {activeTab === 'grievance' && (
            <div className="flex-1 p-6 lg:p-10 overflow-y-auto">
              <h2 className="text-2xl font-bold mb-6">Lodge a Grievance</h2>
              <form onSubmit={submitGrievance} className="max-w-2xl space-y-6">
                <div>
                  <label className="block text-sm font-bold text-muted-foreground mb-2">Category</label>
                  <select 
                    required
                    value={grievanceData.type}
                    onChange={e => setGrievanceData({...grievanceData, type: e.target.value})}
                    className="w-full bg-background border border-border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="">Select Category</option>
                    <option value="academic">Academic & Examinations</option>
                    <option value="infrastructure">Infrastructure & IT</option>
                    <option value="hostel">Hostel & Mess</option>
                    <option value="ragging">Anti-Ragging Squad</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-muted-foreground mb-2">Subject</label>
                  <input 
                    required
                    type="text"
                    value={grievanceData.subject}
                    onChange={e => setGrievanceData({...grievanceData, subject: e.target.value})}
                    placeholder="Brief title of your issue"
                    className="w-full bg-background border border-border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-muted-foreground mb-2">Detailed Description</label>
                  <textarea 
                    required
                    rows="5"
                    value={grievanceData.description}
                    onChange={e => setGrievanceData({...grievanceData, description: e.target.value})}
                    placeholder="Elaborate your issue in detail..."
                    className="w-full bg-background border border-border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-y"
                  ></textarea>
                </div>
                <button type="submit" className="bg-primary text-primary-foreground font-bold px-8 py-3 rounded-lg shadow-md hover:bg-primary/90 transition-colors">
                  Submit Grievance
                </button>
              </form>
            </div>
          )}

          {/* Certificates Tab */}
          {activeTab === 'certificates' && (
            <div className="flex-1 p-6 lg:p-10 overflow-y-auto">
              <h2 className="text-2xl font-bold mb-6">Document Requests</h2>
              <form onSubmit={submitCertificate} className="max-w-2xl space-y-6">
                <div>
                  <label className="block text-sm font-bold text-muted-foreground mb-2">Document Type</label>
                  <select 
                    required
                    value={certificateData.type}
                    onChange={e => setCertificateData({...certificateData, type: e.target.value})}
                    className="w-full bg-background border border-border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="">Select Document Needed</option>
                    <option value="bonafide">Bonafide Certificate</option>
                    <option value="migration">Migration Certificate</option>
                    <option value="leaving">Leaving / Transfer Certificate</option>
                    <option value="provisional">Provisional Degree Certificate</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-muted-foreground mb-2">Reason for Request</label>
                  <textarea 
                    required
                    rows="4"
                    value={certificateData.reason}
                    onChange={e => setCertificateData({...certificateData, reason: e.target.value})}
                    placeholder="Why do you need this certificate? (e.g. Higher Studies, Bank Loan...)"
                    className="w-full bg-background border border-border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-y"
                  ></textarea>
                </div>
                <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4 mb-4">
                  <p className="text-sm font-medium text-amber-700 dark:text-amber-500">
                    Note: Physical collection from the Registrar's Office is required for stamped original copies. E-copies will be mailed.
                  </p>
                </div>
                <button type="submit" className="bg-primary text-primary-foreground font-bold px-8 py-3 rounded-lg shadow-md hover:bg-primary/90 transition-colors">
                  Request Document
                </button>
              </form>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
