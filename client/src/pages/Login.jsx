import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';

export default function Login() {
  const [role, setRole] = useState('student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // 2FA state
  const [requires2FA, setRequires2FA] = useState(false);
  const [otp, setOtp] = useState('');
  const [userId, setUserId] = useState(null);

  const [isLoading, setIsLoading] = useState(false);
  
  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      if (data.requires2FA) {
        setRequires2FA(true);
        setUserId(data.userId);
        toast('Please enter your 2FA code', { icon: '🔐' });
      } else {
        loginUser(data);
        toast.success(`Welcome back, ${data.profile?.firstName || data.email}!`);
        navigate('/');
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify2FA = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth/verify-2fa`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, token: otp }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Invalid OTP');
      }

      loginUser(data);
      toast.success(`Welcome back, ${data.profile?.firstName || data.email}!`);
      navigate('/');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {/* Left pane - Image */}
      <div className="hidden lg:flex w-1/2 relative bg-primary">
        <div className="absolute inset-0 bg-primary/40 mix-blend-multiply z-10" />
        <img 
          src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80" 
          alt="University Campus" 
          className="object-cover w-full h-full"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/90 to-transparent z-20" />
        <div className="absolute bottom-12 left-12 z-30 text-primary-foreground max-w-xl">
          <h1 className="text-4xl font-bold mb-4 tracking-tight">Welcome to the Future of Learning.</h1>
          <p className="text-lg opacity-90 leading-relaxed">
            Access your courses, manage your schedule, and connect with peers seamlessly through our intelligent ERP portal.
          </p>
        </div>
      </div>

      {/* Right pane - Auth Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-24 relative overflow-hidden">
        {/* Decorative blobs */}
        <div className="absolute top-0 right-0 -mr-32 -mt-32 w-96 h-96 rounded-full bg-accent/10 blur-3xl" />
        <div className="absolute bottom-0 left-0 -ml-32 -mb-32 w-96 h-96 rounded-full bg-primary/10 blur-3xl" />

        <div className="w-full max-w-md relative z-10 glass-panel p-8 sm:p-10 rounded-2xl shadow-xl shadow-primary/5 border border-white/10 dark:border-white/5">
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/30 mb-6">
              <svg className="w-8 h-8 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0v6m0-6l-9 5-9-5" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-center tracking-tight text-foreground">
              {requires2FA ? 'Two-Factor Authentication' : 'Account Login'}
            </h2>
            <p className="text-muted-foreground mt-2 text-center text-sm">
              {requires2FA 
                ? 'Check your authenticator app for the 6-digit code.' 
                : 'Enter your credentials to access the portal.'}
            </p>
          </div>

          {!requires2FA ? (
            <form onSubmit={handleLogin} className="space-y-5">
              {/* Role Selection Tabs */}
              <div className="grid grid-cols-3 gap-2 p-1 bg-muted/50 rounded-lg relative">
                {['student', 'staff', 'admin'].map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRole(r)}
                    className={`py-2 px-3 text-sm font-medium rounded-md transition-all duration-200 ${
                      role === r 
                        ? 'bg-background shadow-sm text-primary border border-border/50' 
                        : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
                    }`}
                  >
                    {r.charAt(0).toUpperCase() + r.slice(1)}
                  </button>
                ))}
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">Email Address</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@erp.com"
                    className="flex h-10 w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
                  />
                </div>
                
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-foreground">Password</label>
                    <a href="#" className="text-xs text-primary hover:underline font-medium transition-all">
                      Forgot password?
                    </a>
                  </div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="flex h-10 w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 mt-4 shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                    Signing in...
                  </span>
                ) : 'Sign In'}
              </button>

              <div className="text-center mt-6 pt-4 border-t border-border/50">
                <a 
                  href="#" 
                  onClick={(e) => { e.preventDefault(); setRole('alumni'); }} 
                  className="text-sm text-muted-foreground hover:text-accent font-medium transition-colors"
                >
                  Passout Student? Click Here
                </a>
              </div>
            </form>
          ) : (
            <form onSubmit={handleVerify2FA} className="space-y-5 flex flex-col items-center">
              <div className="space-y-1.5 w-full">
                <input
                  type="text"
                  required
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
                  placeholder="000000"
                  maxLength={6}
                  className="flex h-12 w-full text-center text-xl tracking-[0.5em] rounded-md border border-input bg-background/50 px-3 py-2 font-mono ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-colors"
                />
              </div>
              
              <button
                type="submit"
                disabled={isLoading || otp.length !== 6}
                className="w-full inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 shadow-md shadow-primary/20"
              >
                {isLoading ? 'Verifying...' : 'Verify & Sign In'}
              </button>

              <button
                type="button"
                onClick={() => {
                  setRequires2FA(false);
                  setOtp('');
                }}
                className="text-sm text-muted-foreground hover:text-foreground mt-4 transition-colors"
              >
                Cancel and go back
              </button>
            </form>
          )}

        </div>
      </div>
    </div>
  );
}
