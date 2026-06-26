import { useState, useRef, useEffect } from 'react';
import { Bell, Search, Menu, LogOut, AlertTriangle, X, CheckCircle2, Info } from 'lucide-react';

export default function Header({ activeTab, setActiveTab, onMenuToggle, currentUser, onLogout }) {
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const searchInputRef = useRef(null);

  // Focus search input when modal opens
  useEffect(() => {
    if (showSearch && searchInputRef.current) {
      setTimeout(() => searchInputRef.current.focus(), 50);
    }
  }, [showSearch]);

  // Mock Notifications Data
  const mockNotifications = [
    { id: 1, type: 'success', text: 'CRM Environment Provisioned', time: '2m ago' },
    { id: 2, type: 'info', text: 'New Partner "EcoStrata" registered', time: '1h ago' },
    { id: 3, type: 'warning', text: 'Storage node near capacity (85%)', time: '3h ago' }
  ];

  // Close dropdowns when clicking outside (simple implementation: close on click on main container)
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        setShowSearch(false);
        setShowNotifications(false);
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  // Extract initials from user name
  const initials = currentUser?.name
    ? currentUser.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : 'US';

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between w-full h-16 px-3 sm:px-4 border-b border-slate-200 bg-white shadow-sm">
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Sidebar toggle button (Menu) */}
        <button 
          onClick={onMenuToggle}
          className="p-2 -ml-1 rounded-full hover:bg-slate-100 text-slate-700 transition-colors lg:hidden"
          aria-label="Toggle Navigation Drawer"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Custom Logo Design mimicking brandsparkx */}
        <div className="flex items-center gap-1.5 sm:gap-2 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
          <div className="relative flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 rounded border-2 border-slate-900 bg-white shrink-0">
            <div className="absolute inset-y-[3px] left-[3px] w-[4px] border-l-2 border-t-2 border-b-2 border-slate-900 rounded-l"></div>
            <div className="w-[6px] h-[6px] rounded-full bg-[#0058be]"></div>
          </div>
          <span className="font-headline text-lg sm:text-2xl font-bold tracking-tight text-slate-900">brandsparkx</span>
        </div>
      </div>

      {/* Navigation shortcuts for desktop */}
      <div className="hidden md:flex items-center gap-6">
        {currentUser?.role === 'admin' && (
          <button
            onClick={() => setActiveTab('create')}
            className={`font-body text-sm font-semibold transition-colors py-1.5 px-3 rounded-md ${
              activeTab === 'create'
                ? 'text-[#0058be] bg-blue-50'
                : 'text-slate-600 hover:text-[#0058be]'
            }`}
          >
            Create New Demo
          </button>
        )}
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`font-body text-sm font-semibold transition-colors py-1.5 px-3 rounded-md ${
            activeTab === 'dashboard'
              ? 'text-[#0058be] bg-blue-50'
              : 'text-slate-600 hover:text-[#0058be]'
          }`}
        >
          Dashboard
        </button>
        <button
          onClick={() => setActiveTab('environments')}
          className={`font-body text-sm font-semibold transition-colors py-1.5 px-3 rounded-md ${
            activeTab === 'environments'
              ? 'text-[#0058be] bg-blue-50'
              : 'text-slate-600 hover:text-[#0058be]'
          }`}
        >
          Environments
        </button>
        <button
          onClick={() => setActiveTab('analytics')}
          className={`font-body text-sm font-semibold transition-colors py-1.5 px-3 rounded-md ${
            activeTab === 'analytics'
              ? 'text-[#0058be] bg-blue-50'
              : 'text-slate-600 hover:text-[#0058be]'
          }`}
        >
          Analytics
        </button>
      </div>

      {/* Actions and Profile Avatar */}
      <div className="flex items-center gap-1.5 sm:gap-3 relative">
        <button 
          onClick={() => setShowSearch(true)}
          className="p-2 text-slate-500 rounded-full hover:bg-slate-100 transition-colors"
        >
          <Search className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
        </button>
        
        <div className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className={`relative p-2 rounded-full transition-colors ${showNotifications ? 'bg-blue-50 text-[#0058be]' : 'text-slate-500 hover:bg-slate-100'}`}
          >
            <Bell className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#0058be]" />
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 overflow-hidden animate-in slide-in-from-top-2 duration-200">
              <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                <h3 className="font-headline font-bold text-sm text-slate-800">Notifications</h3>
                <span className="text-[10px] font-bold text-[#0058be] uppercase tracking-wider bg-blue-100 px-2 py-0.5 rounded-full">3 New</span>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {mockNotifications.map(note => (
                  <div key={note.id} className="p-4 border-b border-slate-50 hover:bg-slate-50 transition-colors flex gap-3 cursor-pointer">
                    <div className={`mt-0.5 shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                      note.type === 'success' ? 'bg-green-100 text-green-600' :
                      note.type === 'info' ? 'bg-blue-100 text-blue-600' :
                      'bg-amber-100 text-amber-600'
                    }`}>
                      {note.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : 
                       note.type === 'warning' ? <AlertTriangle className="w-4 h-4" /> : 
                       <Info className="w-4 h-4" />}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-800">{note.text}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{note.time}</p>
                    </div>
                  </div>
                ))}
              </div>
              <button 
                onClick={() => setShowNotifications(false)}
                className="w-full p-3 text-xs font-bold text-slate-500 hover:text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Mark all as read
              </button>
            </div>
          )}
        </div>
        
        {/* User Profile Info & Logout */}
        <div className="flex items-center gap-2 pl-2 sm:pl-3 border-l border-slate-200">
          
          <div 
            className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => setActiveTab('admin')}
            title="Open Admin Portal"
          >
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-blue-50 text-[#0058be] border border-blue-150 flex items-center justify-center font-bold text-[10px] sm:text-xs shadow-sm shrink-0">
              {initials}
            </div>
            <div className="hidden sm:flex flex-col text-left">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-slate-900 leading-tight max-w-[100px] truncate">
                  {currentUser?.name || 'Partner Account'}
                </span>
                <span className={`px-1.5 rounded-[4px] text-[8px] font-extrabold uppercase border select-none ${
                  currentUser?.role === 'admin' 
                    ? 'bg-blue-50 text-[#0058be] border-blue-150' 
                    : 'bg-emerald-50 text-emerald-700 border-emerald-150'
                }`}>
                  {currentUser?.role || 'Admin'}
                </span>
              </div>
              <span className="text-[10px] text-slate-400 font-medium max-w-[120px] truncate">
                {currentUser?.email || 'admin@brandsparkx.com'}
              </span>
            </div>
          </div>

          <button 
            onClick={() => setShowLogoutConfirm(true)}
            className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all cursor-pointer"
            title="Deauthenticate Session"
          >
            <LogOut className="w-4 h-4" />
          </button>

        </div>
      </div>

      {/* Custom Logout Confirmation Dialog */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-200/80 animate-in zoom-in-95 duration-200 text-center">
            <div className="w-12 h-12 rounded-full bg-red-50 text-red-500 flex items-center justify-center mx-auto mb-4 border border-red-100">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="font-headline text-lg font-bold text-slate-900">Deauthenticate Session?</h3>
            <p className="font-sans text-xs text-slate-500 mt-2 leading-relaxed">
              You are about to terminate your active telemetry partner access session.
            </p>
            <div className="flex gap-2.5 mt-6 w-full">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 py-2.5 border border-slate-250 hover:bg-slate-50 text-slate-600 text-xs font-bold rounded-xl transition-all border-slate-200 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowLogoutConfirm(false);
                  onLogout();
                }}
                className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl transition-all shadow-md cursor-pointer"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Full Screen Search Modal (Command Palette Style) */}
      {showSearch && (
        <div className="fixed inset-0 z-[200] flex items-start justify-center pt-[15vh] p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200">
          <div 
            className="absolute inset-0 cursor-pointer" 
            onClick={() => setShowSearch(false)}
          />
          <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200/80 animate-in slide-in-from-top-4 duration-200 overflow-hidden relative z-10 flex flex-col">
            <div className="p-4 border-b border-slate-100 flex items-center gap-3">
              <Search className="w-5 h-5 text-slate-400" />
              <input 
                ref={searchInputRef}
                type="text" 
                placeholder="Search environments, clients, or logs..."
                className="w-full text-lg font-sans outline-none text-slate-800 placeholder-slate-400 bg-transparent"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
              <button 
                onClick={() => setShowSearch(false)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="bg-slate-50 p-6 min-h-[200px]">
              {searchQuery.length > 0 ? (
                <div className="text-center mt-10">
                  <div className="w-12 h-12 rounded-full bg-slate-200/50 flex items-center justify-center mx-auto mb-3">
                    <Search className="w-5 h-5 text-slate-400" />
                  </div>
                  <p className="text-sm font-semibold text-slate-600">No matching environments found for "{searchQuery}"</p>
                  <p className="text-xs text-slate-400 mt-1">Try searching by client name or product type.</p>
                </div>
              ) : (
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Quick Suggestions</h4>
                  <div className="flex flex-col gap-1.5">
                    <button className="text-left px-3 py-2 rounded-lg hover:bg-white border border-transparent hover:border-slate-200 hover:shadow-sm text-sm font-semibold text-slate-700 transition-all flex items-center gap-2">
                      <Search className="w-3.5 h-3.5 text-slate-400" />
                      View all active deployments
                    </button>
                    <button className="text-left px-3 py-2 rounded-lg hover:bg-white border border-transparent hover:border-slate-200 hover:shadow-sm text-sm font-semibold text-slate-700 transition-all flex items-center gap-2">
                      <Search className="w-3.5 h-3.5 text-slate-400" />
                      Search audit logs
                    </button>
                  </div>
                </div>
              )}
            </div>
            <div className="bg-white border-t border-slate-100 p-3 flex justify-between items-center">
              <div className="flex gap-4">
                <span className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase">
                  <kbd className="font-mono bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded text-slate-500">ESC</kbd> to close
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
