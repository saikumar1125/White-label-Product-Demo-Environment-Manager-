import { useState, useEffect } from 'react';
import { Lock, Mail, Eye, EyeOff, ShieldCheck, AlertCircle, Sparkles, User, Globe } from 'lucide-react';

export default function LoginView({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Google Sign-in simulation states
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [customGoogleEmail, setCustomGoogleEmail] = useState('');
  const [googleStep, setGoogleStep] = useState('list'); // 'list' or 'custom'
  const [hasGoogleClient, setHasGoogleClient] = useState(false);

  const demoAccounts = [
    { email: 'admin@brandsparkx.com', name: 'BrandSparkX Admin', role: 'Admin', desc: 'Global Control & Audits', color: 'bg-blue-150 text-[#0058be] border-blue-200' },
    { email: 'admin@gdc.com', name: 'Global Dynamics Corp', role: 'Client', desc: 'Enterprise SaaS Sandbox', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' }
  ];

  // Try initializing Google script
  useEffect(() => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (clientId) {
      setHasGoogleClient(true);
      // Load Google Sign In script
      const script = document.createElement('script');
      script.id = 'google-jssdk';
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = () => {
        if (window.google?.accounts?.id) {
          window.google.accounts.id.initialize({
            client_id: clientId,
            callback: handleGoogleCredentialResponse
          });
          window.google.accounts.id.renderButton(
            document.getElementById('google-signin-btn-container'),
            { theme: 'outline', size: 'large', width: '100%', text: 'signin_with' }
          );
        }
      };
      document.head.appendChild(script);
    }
  }, []);

  const handleGoogleCredentialResponse = async (response) => {
    setIsSubmitting(true);
    setError(null);
    try {
      const res = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ credential: response.credential })
      });
      const data = await res.json();
      if (res.ok && data.token) {
        onLoginSuccess(data.token, data.user);
      } else {
        setError(data.message || 'Google Sign-in failed.');
      }
    } catch (err) {
      setError('Network error: Unable to contact authentication server.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSimulatedGoogleLogin = async (selectedEmail) => {
    setIsSubmitting(true);
    setError(null);
    setShowGoogleModal(false);
    try {
      const res = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ credential: selectedEmail })
      });
      const data = await res.json();
      if (res.ok && data.token) {
        onLoginSuccess(data.token, data.user);
      } else {
        setError(data.message || 'Simulated Google login failed.');
      }
    } catch (err) {
      setError('Network error: Unable to contact authentication server.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.ok && data.token) {
        onLoginSuccess(data.token, data.user);
      } else {
        setError(data.message || 'Login failed. Please verify your credentials.');
      }
    } catch (err) {
      setError('Network error: Unable to contact authentication server.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickLogin = (email, password) => {
    setEmail(email);
    setPassword(password);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fcf8fa] px-4 py-12 relative overflow-hidden font-sans">
      
      {/* Decorative Brand Spark Gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#0058be]/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Login Container Card */}
      <div className="bg-white border border-slate-200/80 p-8 rounded-3xl w-full max-w-md shadow-xl relative z-10 text-slate-800 flex flex-col items-center">
        
        {/* Logo and Brand Title */}
        <div className="flex items-center gap-2.5 mb-6 cursor-default">
          <div className="relative flex items-center justify-center w-9 h-9 rounded border-2 border-slate-900 bg-white">
            <div className="absolute inset-y-[3px] left-[3px] w-[5px] border-l-2 border-t-2 border-b-2 border-slate-900 rounded-l"></div>
            <div className="w-[8px] h-[8px] rounded-full bg-[#0058be]"></div>
          </div>
          <span className="font-headline text-3xl font-bold tracking-tight text-slate-900">brandsparkx</span>
        </div>

        <div className="text-center mb-6">
          <h2 className="font-headline text-lg font-bold text-slate-800 uppercase tracking-wider">
            Telemetry Control Panel
          </h2>
          <p className="text-xs text-slate-500 mt-1.5 font-medium leading-relaxed max-w-xs mx-auto">
            Authorized Partner access required. Enter credentials to unlock sandbox hypervisor dashboard.
          </p>
        </div>

        {/* Error Notification Alert */}
        {error && (
          <div className="w-full bg-red-50 border border-red-200 p-3.5 rounded-xl mb-5 flex items-start gap-2.5 animate-in fade-in zoom-in-95 duration-150">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <p className="text-xs font-semibold text-red-800 leading-normal">{error}</p>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="w-full space-y-5">
          {/* Email input field */}
          <div className="flex flex-col gap-2">
            <label htmlFor="login_email" className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4.5 h-4.5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                id="login_email"
                type="email"
                required
                placeholder="partner@brandsparkx.com"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-11 pr-4 text-sm font-sans text-slate-800 outline-none transition-all placeholder-slate-400 focus:bg-white focus:border-[#0058be] focus:ring-1 focus:ring-[#0058be] font-medium"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          {/* Password input field */}
          <div className="flex flex-col gap-2">
            <label htmlFor="login_password" className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">
              Access Token / Password
            </label>
            <div className="relative">
              <Lock className="w-4.5 h-4.5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                id="login_password"
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="••••••••"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-11 pr-11 text-sm font-sans text-slate-800 outline-none transition-all placeholder-slate-400 focus:bg-white focus:border-[#0058be] focus:ring-1 focus:ring-[#0058be] font-medium"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#0058be] transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Submit/Unlock Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#0058be] hover:bg-[#004eab] text-white py-3 rounded-xl font-sans text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 mt-2 transition-colors shadow-md active:scale-95 duration-100 disabled:opacity-50 cursor-pointer"
          >
            {isSubmitting ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <ShieldCheck className="w-4.5 h-4.5" />
                Authenticate Session
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center w-full my-5">
          <div className="flex-1 border-t border-slate-200"></div>
          <span className="px-3 text-xs font-bold text-slate-400 uppercase font-mono tracking-widest">or</span>
          <div className="flex-1 border-t border-slate-200"></div>
        </div>

        {/* Google Authentication Section */}
        <div className="w-full">
          {hasGoogleClient ? (
            <div id="google-signin-btn-container" className="w-full flex justify-center" />
          ) : (
            <button
              onClick={() => {
                setGoogleStep('list');
                setShowGoogleModal(true);
              }}
              className="w-full flex items-center justify-center gap-3 bg-white border border-slate-350 hover:bg-slate-50 text-slate-700 py-2.5 px-4 rounded-xl text-xs font-bold transition-all shadow-xs border-slate-300 cursor-pointer hover:border-slate-400"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#EA4335"
                  d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.136 4.114A5.94 5.94 0 0 1 8 12.571a5.94 5.94 0 0 1 5.99-5.943c1.603 0 3.036.634 4.1 1.666l3.1-3.095C19.294 3.333 16.794 2 13.99 2 8.163 2 3.428 6.735 3.428 12.571S8.163 23.143 13.99 23.143c5.637 0 10.155-4.476 10.155-10.286 0-.666-.073-1.314-.205-1.933H12.24Z"
                />
              </svg>
              Sign in with Google
            </button>
          )}
        </div>



        {/* System Footnote */}
        <div className="text-[10px] text-slate-400 font-mono mt-6 border-t border-slate-100 pt-4 w-full text-center">
          brandsparkx v2.4.0 • Node: AP-South
        </div>

      </div>

      {/* Simulated Google Authentication Dialog Modal */}
      {showGoogleModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-sm w-full shadow-2xl border border-slate-200/80 p-6 flex flex-col items-center animate-in fade-in zoom-in-95 duration-200 font-sans">
            
            {/* Google Logo */}
            <div className="flex items-center gap-1.5 mb-6">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.85z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.85c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              <span className="font-headline font-bold text-slate-800 text-sm tracking-tight">Sign in with Google</span>
            </div>

            {googleStep === 'list' ? (
              <>
                <div className="text-center mb-6">
                  <h3 className="font-headline font-bold text-base text-slate-800">Choose an account</h3>
                  <p className="text-xs text-slate-400 mt-1">to continue to <span className="font-bold text-[#0058be]">BrandSparkX Portal</span></p>
                </div>

                {/* Preseeded Accounts List */}
                <div className="w-full space-y-2 max-h-[260px] overflow-y-auto pr-1">
                  {demoAccounts.map((account) => (
                    <button
                      key={account.email}
                      onClick={() => handleSimulatedGoogleLogin(account.email)}
                      className="w-full flex items-center justify-between p-3 border border-slate-200/80 rounded-2xl hover:bg-slate-50 transition-all text-left group cursor-pointer hover:border-slate-350"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                          <User className="w-4 h-4 text-slate-500" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-slate-800 truncate leading-snug">{account.name}</p>
                          <p className="text-[10px] text-slate-400 truncate">{account.email}</p>
                        </div>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[8px] font-extrabold uppercase border ${account.color} select-none`}>
                        {account.role}
                      </span>
                    </button>
                  ))}

                  {/* Add New Account Button */}
                  <button
                    onClick={() => setGoogleStep('custom')}
                    className="w-full flex items-center gap-3 p-3 border border-dashed border-slate-300 rounded-2xl hover:bg-slate-50 hover:border-slate-400 transition-all text-left cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-full bg-slate-50 border border-slate-200 border-dashed flex items-center justify-center shrink-0">
                      <Globe className="w-4 h-4 text-slate-400" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-700">Use another email</p>
                      <p className="text-[10px] text-slate-400">Simulate a brand new client registration</p>
                    </div>
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="text-center mb-5 w-full">
                  <h3 className="font-headline font-bold text-base text-slate-800">Simulate Google Authentication</h3>
                  <p className="text-xs text-slate-400 mt-1">Enter any email address to register a new client company dynamically</p>
                </div>

                <div className="w-full space-y-4">
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="custom_google_email" className="text-[9px] font-bold text-slate-450 text-slate-400 uppercase tracking-wider">
                      Google Account Email
                    </label>
                    <input
                      id="custom_google_email"
                      type="email"
                      required
                      placeholder="client@enterprise-group.com"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3.5 text-xs font-semibold text-slate-800 outline-none placeholder-slate-400 focus:bg-white focus:border-[#0058be]"
                      value={customGoogleEmail}
                      onChange={(e) => setCustomGoogleEmail(e.target.value)}
                    />
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => setGoogleStep('list')}
                      className="flex-1 py-2 border border-slate-250 hover:bg-slate-50 text-slate-600 text-xs font-bold rounded-xl transition-all border-slate-200"
                    >
                      Back
                    </button>
                    <button
                      onClick={() => {
                        if (customGoogleEmail && customGoogleEmail.includes('@')) {
                          handleSimulatedGoogleLogin(customGoogleEmail);
                        } else {
                          alert('Please enter a valid email address.');
                        }
                      }}
                      className="flex-1 py-2 bg-[#0058be] hover:bg-[#004eab] text-white text-xs font-bold rounded-xl transition-all shadow-md"
                    >
                      Authenticate
                    </button>
                  </div>
                </div>
              </>
            )}

            <button
              onClick={() => setShowGoogleModal(false)}
              className="mt-6 text-[10px] font-bold text-slate-400 hover:text-slate-600 transition-colors uppercase tracking-wider"
            >
              Cancel
            </button>

          </div>
        </div>
      )}

    </div>
  );
}
