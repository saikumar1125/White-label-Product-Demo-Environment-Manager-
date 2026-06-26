import { useState, useEffect } from 'react';
import { 
  Terminal, 
  X, 
  Server
} from 'lucide-react';
import Header from './components/Header.jsx';
import NavigationDrawer from './components/NavigationDrawer.jsx';
import BottomNav from './components/BottomNav.jsx';
import DashboardView from './components/DashboardView.jsx';
import CreateView from './components/CreateView.jsx';
import EnvironmentsView from './components/EnvironmentsView.jsx';
import AnalyticsView from './components/AnalyticsView.jsx';
import LoginView from './components/LoginView.jsx';
import AdminPortalView from './components/AdminPortalView.jsx';

import { INITIAL_DEMOS, INITIAL_LOGS } from './data.js';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [showLogsSideover, setShowLogsSideover] = useState(false);

  // Authentication State
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('brandsparkx_auth_token'));
  const [authLoading, setAuthLoading] = useState(true);

  const [demos, setDemos] = useState([]);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [backendStatus, setBackendStatus] = useState('Checking...');

  const API_BASE = '/api';

  // Validate session token on mount
  useEffect(() => {
    const validateSession = async () => {
      if (!token) {
        setAuthLoading(false);
        return;
      }
      try {
        const res = await fetch(`${API_BASE}/auth/me`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (res.ok) {
          const user = await res.json();
          setCurrentUser(user);
        } else {
          // Token expired or invalid
          localStorage.removeItem('brandsparkx_auth_token');
          setToken(null);
        }
      } catch (err) {
        console.warn('Session verification offline, using local session state');
        // If server is down, keep session if token was previously saved
        setCurrentUser({ email: 'admin@brandsparkx.com', name: 'BrandSparkX Admin' });
      } finally {
        setAuthLoading(false);
      }
    };
    validateSession();
  }, [token]);

  // Fetch all environments and logs from Express backend
  const fetchData = async (showLoading = false) => {
    if (!currentUser) return; // Fetch only if authenticated
    if (showLoading) setLoading(true);
    try {
      // 1. Fetch environments
      const envRes = await fetch(`${API_BASE}/environments`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (envRes.ok) {
        const envData = await envRes.json();
        setDemos(envData);
      } else {
        throw new Error('Failed to load environments');
      }

      // 2. Fetch logs
      const logRes = await fetch(`${API_BASE}/logs`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (logRes.ok) {
        const logData = await logRes.json();
        setLogs(logData);
      } else {
        throw new Error('Failed to load logs');
      }
      
      setBackendStatus('Connected');
    } catch (err) {
      console.warn('API backend unreachable, falling back to local memory simulation:', err.message);
      setBackendStatus('Local Fallback');
      setDemos(prev => prev.length ? prev : INITIAL_DEMOS);
      setLogs(prev => prev.length ? prev : INITIAL_LOGS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser) {
      fetchData(true);

      const interval = setInterval(() => {
        fetchData(false);
      }, 4000);

      return () => clearInterval(interval);
    }
  }, [currentUser]);

  // Login handler
  const handleLoginSuccess = (userToken, user) => {
    localStorage.setItem('brandsparkx_auth_token', userToken);
    setToken(userToken);
    setCurrentUser(user);
  };

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem('brandsparkx_auth_token');
    setToken(null);
    setCurrentUser(null);
    setDemos([]);
    setLogs([]);
  };

  // Add demo via POST /api/environments
  const handleAddDemo = async (newDemo) => {
    try {
      const res = await fetch(`${API_BASE}/environments`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newDemo)
      });
      if (res.ok) {
        fetchData(false);
      } else {
        throw new Error('POST failed');
      }
    } catch (err) {
      console.error(err);
      setDemos(prev => [newDemo, ...prev]);
      const creationLog = {
        id: 'LOG_' + Math.random().toString(36).substr(2, 9),
        timestamp: new Date().toTimeString().split(' ')[0],
        type: 'info',
        client: newDemo.clientName,
        message: `Began deployment task. Allocating cluster resources, pulling product image ${newDemo.productLabel} (Local mode).`
      };
      setLogs(prev => [creationLog, ...prev]);
    }
  };

  // Modify demo variables via PATCH /api/environments/:id
  const handleUpdateDemo = async (demoId, updatedFields) => {
    try {
      const res = await fetch(`${API_BASE}/environments/${demoId}`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updatedFields)
      });
      if (res.ok) {
        fetchData(false);
      } else {
        throw new Error('PATCH failed');
      }
    } catch (err) {
      console.error(err);
      setDemos(prev => prev.map((demo) => {
        if (demo.id === demoId) {
          return { ...demo, ...updatedFields };
        }
        return demo;
      }));
    }
  };

  // Delete/Terminate demo environment via DELETE /api/environments/:id
  const handleDeleteDemo = async (demoId) => {
    try {
      const res = await fetch(`${API_BASE}/environments/${demoId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        fetchData(false);
      } else {
        throw new Error('DELETE failed');
      }
    } catch (err) {
      console.error(err);
      const demoToDelete = demos.find(d => d.id === demoId);
      setDemos(prev => prev.filter(demo => demo.id !== demoId));

      if (demoToDelete) {
        const terminationLog = {
          id: 'LOG_' + Math.random().toString(36).substr(2, 9),
          timestamp: new Date().toTimeString().split(' ')[0],
          type: 'warn',
          client: demoToDelete.clientName,
          message: `Manually terminated by Expert Partner. Reclaimed memory blocks and virtual storage nodes (Local mode).`
        };
        setLogs(prev => [terminationLog, ...prev]);
      }
    }
  };

  // Clear Audit Log Index
  const handleClearLogs = async () => {
    try {
      const res = await fetch(`${API_BASE}/logs/clear`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        fetchData(false);
      } else {
        throw new Error('Clear logs failed');
      }
    } catch (err) {
      console.error(err);
      const clearLog = {
        id: 'LOG_CLEAR',
        timestamp: new Date().toTimeString().split(' ')[0],
        type: 'info',
        client: 'SYSTEM',
        message: 'Auditing log index cleared by brandsparkx administrator (Local mode).'
      };
      setLogs([clearLog]);
    }
  };

  // Tab view router layout
  const renderViewContent = () => {
    if (loading) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
          <div className="w-10 h-10 border-4 border-[#0058be] border-t-transparent rounded-full animate-spin" />
          <p className="font-sans text-sm font-semibold text-slate-500">Contacting cluster telemetry API...</p>
        </div>
      );
    }

    switch (activeTab) {
      case 'dashboard':
        return (
          <DashboardView 
            demos={demos} 
            setActiveTab={setActiveTab} 
            onViewDetailedLogs={() => setShowLogsSideover(true)}
            currentUser={currentUser}
          />
        );
      case 'environments':
        return (
          <EnvironmentsView 
            demos={demos}
            onAddDemo={handleAddDemo}
            onUpdateDemo={handleUpdateDemo}
            onDeleteDemo={handleDeleteDemo}
            setActiveTab={setActiveTab}
            currentUser={currentUser}
          />
        );
      case 'create':
        if (currentUser?.role !== 'admin') {
          return (
            <DashboardView 
              demos={demos} 
              setActiveTab={setActiveTab} 
              onViewDetailedLogs={() => setShowLogsSideover(true)}
              currentUser={currentUser}
            />
          );
        }
        return (
          <CreateView 
            onAddDemo={handleAddDemo} 
            setActiveTab={setActiveTab} 
            currentUser={currentUser}
          />
        );
      case 'analytics':
        return <AnalyticsView demos={demos} currentUser={currentUser} />;
      case 'admin':
        return <AdminPortalView currentUser={currentUser} />;
      default:
        return (
          <DashboardView 
            demos={demos} 
            setActiveTab={setActiveTab} 
            onViewDetailedLogs={() => setShowLogsSideover(true)}
            currentUser={currentUser}
          />
        );
    }
  };

  // Render auth loading state
  if (authLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#0b0f19] gap-4">
        <div className="w-10 h-10 border-4 border-blue-400 border-t-transparent rounded-full animate-spin" />
        <p className="font-sans text-sm font-bold text-slate-450 text-slate-400">Verifying security token...</p>
      </div>
    );
  }

  // Redirect to Login if not authenticated
  if (!currentUser) {
    return <LoginView onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="bg-[#fcf8fa] min-h-screen font-sans antialiased text-slate-700 selection:bg-blue-150 selection:text-slate-900 pb-16 md:pb-0">
      
      {/* 1. Global Navigation Top Header */}
      <Header 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onMenuToggle={() => setDrawerOpen(!drawerOpen)} 
        currentUser={currentUser}
        onLogout={handleLogout}
      />

      <div className="flex">
        {/* 2. Side Desktop Navigation Sidebar Drawer */}
        <NavigationDrawer 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          isOpen={drawerOpen} 
          onClose={() => setDrawerOpen(false)}
          currentUser={currentUser}
        />

        {/* 3. Main Dashboard Routing Viewport */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 lg:ml-64 transition-all duration-300 min-h-[calc(100vh-64px)] max-w-[1300px] mx-auto w-full">
          

          {renderViewContent()}
        </main>
      </div>

      {/* 4. Mobile Sticky Bottom Navigation Toolbar */}
      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} currentUser={currentUser} />

      {/* 5. Hypervisor Telemetry Audits / Logs Sliding Panel Drawer */}
      {showLogsSideover && (
        <div className="fixed inset-0 z-[100] flex justify-end bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-slate-950 text-slate-100 w-full max-w-lg h-full p-6 shadow-2xl flex flex-col justify-between border-l border-slate-800 animate-in slide-in-from-right duration-250">
            
            {/* Slideover Title Header */}
            <div>
              <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-5">
                <div className="flex items-center gap-2">
                  <Terminal className="w-5 h-5 text-blue-400" />
                  <h3 className="font-headline text-base font-bold text-white uppercase tracking-wider">
                    Detailed Cluster Audits
                  </h3>
                </div>
                <button 
                  onClick={() => setShowLogsSideover(false)}
                  className="p-1 rounded-full hover:bg-slate-800 text-slate-450 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Status Header Overview */}
              <div className="p-3.5 bg-slate-900/60 border border-slate-800 rounded-xl mb-4 text-xs space-y-1.5 font-sans">
                <div className="flex justify-between">
                  <span className="text-slate-400">Total Audit Streams:</span>
                  <span className="font-bold text-slate-200">{logs.length} Log events</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">SRE Health Status:</span>
                  <span className="font-bold text-green-400">Systems Operational</span>
                </div>
              </div>
            </div>

            {/* Event Audit Stream Scrolling Frame (mock console style) */}
            <div className="flex-1 overflow-y-auto space-y-3.5 pr-1 font-mono text-[11px] leading-relaxed custom-scrollbar py-2">
              {logs.map((log) => {
                const badgeStyles = {
                  success: 'text-green-400 bg-green-500/10 border-green-500/20',
                  info: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
                  warn: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
                  error: 'text-red-400 bg-red-500/10 border-red-500/20'
                };

                return (
                  <div key={log.id} className="p-3 bg-slate-900/40 rounded-lg border border-slate-900 flex flex-col gap-1.5">
                    <div className="flex justify-between items-center text-[10px]">
                      <span className="text-slate-500">{log.timestamp}</span>
                      <span className={`px-2 py-0.5 rounded border ${badgeStyles[log.type]} font-sans font-bold uppercase tracking-widest text-[9px]`}>
                        {log.type}
                      </span>
                    </div>
                    <p className="text-slate-200 font-sans font-bold tracking-tight">
                      Client: {log.client}
                    </p>
                    <p className="text-slate-400">
                      {log.message}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Console actions */}
            <div className="border-t border-slate-800 pt-4 mt-6 flex gap-2">
              <button 
                onClick={handleClearLogs}
                className="flex-1 py-2 border border-slate-800 hover:bg-slate-900 text-slate-450 hover:text-white text-xs font-semibold rounded-lg transition-colors font-sans hover:border-slate-700"
              >
                Clear Log Index
              </button>
              <button 
                onClick={() => setShowLogsSideover(false)}
                className="flex-1 py-2 bg-[#0058be] hover:bg-[#004eab] text-white text-xs font-semibold rounded-lg font-sans shadow-md"
              >
                Dismiss console
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
