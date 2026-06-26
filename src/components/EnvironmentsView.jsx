import { useState } from 'react';
import { 
  Search, 
  Trash2, 
  Eye, 
  PlusCircle, 
  Fingerprint, 
  Calendar, 
  AlertTriangle, 
  Hourglass, 
  Ban, 
  X,
  Clock,
  ChevronLeft,
  ChevronRight,
  Sparkles
} from 'lucide-react';

export default function EnvironmentsView({ 
  demos, 
  onAddDemo, 
  onUpdateDemo, 
  onDeleteDemo, 
  setActiveTab,
  currentUser
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  
  // Selected environment for detail modal/login simulation
  const [selectedDemo, setSelectedDemo] = useState(null);
  const [simulatedLoginDetails, setSimulatedLoginDetails] = useState(null);

  // Pagination mocks
  const [page, setPage] = useState(1);

  const isAdmin = currentUser?.role === 'admin';

  // Filtering
  const filteredDemos = demos.filter((demo) => {
    const matchesSearch = 
      demo.clientName.toLowerCase().includes(searchQuery.toLowerCase()) || 
      demo.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      demo.productLabel.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (filterStatus === 'All') return true;
    return demo.status === filterStatus;
  });

  // Action execution simulations
  const handleExtend = (demo) => {
    onUpdateDemo(demo.id, {
      expiresAt: 'Nov 30, 2026',
      lastActivity: 'Extended Just Now',
    });
    alert(`License extended successfully for ${demo.clientName}! New expiry date: Nov 30, 2026.`);
  };

  const handleReactivate = (demo) => {
    onUpdateDemo(demo.id, {
      status: 'Active',
      expiresAt: 'Dec 15, 2026',
      lastActivity: 'Reactivated Just Now',
      healthScore: 100,
      loadState: 'Operational'
    });
    alert(`Cluster reactivated successfully for ${demo.clientName}! Status is now Active.`);
  };

  const handleSimulateLogin = (demo) => {
    setSimulatedLoginDetails(demo.clientName);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* View Title and Header actions */}
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="font-headline text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Environment Manager
          </h1>
          <p className="font-sans text-sm text-slate-500 mt-1">
            {isAdmin 
              ? 'Oversee, provision, configure, and control your active white-label sandboxes.' 
              : 'Inspect, monitor, and sign into your production-ready sandbox environments.'}
          </p>
        </div>
        
        {isAdmin && (
          <button
            onClick={() => setActiveTab('create')}
            className="bg-[#0058be] hover:bg-[#004eab] text-white font-sans text-xs font-bold px-5 py-2.5 rounded-xl shadow-md flex items-center gap-2 cursor-pointer scale-100 active:scale-95 duration-100 transition-transform w-fit shrink-0"
          >
            <PlusCircle className="w-4 h-4" />
            Provision New Demo
          </button>
        )}
      </div>

      {/* Persistent Filters & Advanced Search Section */}
      <div className="bg-white border border-slate-200/60 rounded-2xl p-4 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center">
          
          {/* Search box input matching layout */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 pl-9 pr-4 text-xs font-sans outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#0058be] focus:bg-white transition-all text-slate-700 font-medium placeholder-slate-400" 
              placeholder="Search Client Name, Demo ID, or segments..." 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Inline pill buttons matching screenshots */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            {['All', 'Active', 'Provisioning', 'Expired'].map((status) => {
              const count = status === 'All' ? demos.length : demos.filter(d => d.status === status).length;
              return (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold tracking-tight whitespace-nowrap transition-all duration-150 ${
                    filterStatus === status
                      ? 'bg-blue-50 text-[#0058be] font-bold border border-blue-100'
                      : 'bg-slate-50 text-slate-5050 hover:bg-slate-100 border border-transparent text-slate-500'
                  }`}
                >
                  {status} <span className="opacity-60 font-medium font-sans ml-0.5">({count})</span>
                </button>
              );
            })}
          </div>

        </div>
      </div>

      {/* Environments List matching layout designs */}
      <div className="space-y-4">
        {filteredDemos.length === 0 ? (
          <div className="bg-white rounded-2xl p-16 text-center border border-slate-200/50">
            <Ban className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-slate-500 text-sm font-sans font-medium">No demo environments found matching query filters.</p>
          </div>
        ) : (
          filteredDemos.map((demo) => {
            const isPending = demo.status === 'Provisioning';
            const isExpired = demo.status === 'Expired';
            const isHighLoad = demo.healthScore < 85 && demo.status === 'Active';
            const expiresSoon = demo.expiresAt && demo.expiresAt.toLowerCase().includes('expires in');

            return (
              <div 
                key={demo.id} 
                className={`bg-white border rounded-xl p-5 flex flex-col md:flex-row md:items-center gap-5 transition-all duration-200 hover:shadow-md ${
                  isExpired 
                    ? 'border-slate-250 bg-slate-50/70 border-slate-200 opacity-[0.82] grayscale-[0.2]' 
                    : 'border-slate-200/60 shadow-sm'
                }`}
              >
                {/* 1. Client Avatar/Logo Block with brand images placeholders */}
                <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0">
                  <div className={`w-8 h-8 rounded-lg ${demo.avatarBg} ${demo.avatarText} font-headline flex items-center justify-center font-bold text-base shadow-sm`}>
                    {demo.avatarInitials}
                  </div>
                </div>

                {/* 2. Client Metadata Column info */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <h3 className={`font-headline text-lg font-bold truncate ${isExpired ? 'text-slate-600' : 'text-slate-900'}`}>
                      {demo.clientName}
                    </h3>
                    
                    {/* Platform Tag */}
                    <span className="bg-slate-900 text-slate-100 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border border-slate-800">
                      {demo.productLabel}
                    </span>

                    {/* Expiry Warning Warning Tag */}
                    {expiresSoon && (
                      <span className="flex items-center gap-1 font-sans text-xs text-red-600 font-bold bg-red-50 px-2 py-0.5 rounded-lg border border-red-200 animate-pulse">
                        <AlertTriangle className="w-3.5 h-3.5 text-red-500" />
                        Expires in 2 days
                      </span>
                    )}

                    {isHighLoad && (
                      <span className="flex items-center gap-1 font-sans text-xs text-amber-600 font-bold bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200 animate-pulse">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                        High Load Triggered
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center gap-x-6 gap-y-1.5 font-sans text-xs text-slate-500">
                    <div className="flex items-center gap-1">
                      <Fingerprint className="w-4 h-4 text-slate-400" />
                      <span className="font-mono">{demo.id}</span>
                    </div>

                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4 text-slate-400" />
                      <span className={`${isExpired ? 'text-red-500 font-medium' : ''}`}>
                        {demo.expiresAt}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4 text-slate-400" />
                      <span>Last activity: {demo.lastActivity}</span>
                    </div>
                  </div>
                </div>

                {/* 3. Action Buttons and Status */}
                <div className="flex flex-wrap items-center justify-between md:justify-end gap-4 shrink-0 w-full md:w-auto border-t md:border-t-0 border-slate-100 pt-4 md:pt-0">
                  
                  {/* Status Pills */}
                  {demo.status === 'Active' && (
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-50 text-green-700 border border-green-200/80">
                      <div className="w-2 h-2 rounded-full bg-green-600" />
                      <span className="font-sans text-xs font-bold uppercase tracking-wider">Active</span>
                    </div>
                  )}

                  {demo.status === 'Provisioning' && (
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200/80">
                      <Hourglass className="w-3.5 h-3.5 animate-spin" />
                      <span className="font-sans text-xs font-bold uppercase tracking-wider">Deploying</span>
                    </div>
                  )}

                  {demo.status === 'Expired' && (
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-500 border border-slate-300">
                      <span className="font-sans text-xs font-bold uppercase tracking-wider">Expired</span>
                    </div>
                  )}

                  {/* Operational Controls Buttons */}
                  <div className="flex items-center gap-1.5">
                    {/* View full details (Eye icon) */}
                    <button 
                      onClick={() => setSelectedDemo(demo)}
                      className="p-2 border border-slate-200 rounded-xl hover:bg-slate-100 hover:text-slate-900 text-slate-400 hover:border-slate-300 transition-colors"
                      title="Inspect Sandbox Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>

                    {isAdmin ? (
                      <>
                        {/* Expiry Action Button or Login Trigger */}
                        {isExpired ? (
                          <button 
                            onClick={() => handleReactivate(demo)}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-sans text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-sm"
                          >
                            Reactivate
                          </button>
                        ) : (
                          <button 
                            onClick={() => handleSimulateLogin(demo)}
                            className={`font-sans text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-sm ${
                              isPending 
                                ? 'bg-slate-200 text-slate-400 opacity-50 cursor-not-allowed'
                                : 'bg-blue-50 text-[#0058be] hover:bg-blue-100'
                            }`}
                            disabled={isPending}
                          >
                            Login
                          </button>
                        )}

                        {/* Expand License / Cancel details */}
                        {isExpired ? (
                          <button 
                            onClick={() => {
                              if (confirm(`Are you sure you want to delete ${demo.clientName}'s sandbox?`)) {
                                onDeleteDemo(demo.id);
                              }
                            }}
                            className="p-2 bg-red-50 hover:bg-red-500 text-red-600 hover:text-white rounded-xl transition-all"
                            title="Delete Environment permanently"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        ) : (
                          <button 
                            onClick={() => handleExtend(demo)}
                            className={`p-2 rounded-xl transition-all ${
                              expiresSoon 
                                ? 'bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200' 
                                : 'bg-slate-50 hover:bg-slate-100 text-slate-500 hover:text-slate-800'
                            }`}
                            title="Extend License with 30 days"
                          >
                            <Clock className="w-4 h-4" />
                          </button>
                        )}
                      </>
                    ) : (
                      <>
                        {!isExpired && (
                          <button 
                            onClick={() => handleSimulateLogin(demo)}
                            className={`font-sans text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-sm ${
                              isPending 
                                ? 'bg-slate-200 text-slate-400 opacity-50 cursor-not-allowed'
                                : 'bg-blue-50 text-[#0058be] hover:bg-blue-100'
                            }`}
                            disabled={isPending}
                          >
                            Login
                          </button>
                        )}
                      </>
                    )}
                  </div>

                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Responsive Pagination elements matching page mocks */}
      <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-8">
          <div className="flex flex-col">
            <span className="font-sans text-[11px] font-bold text-slate-400 uppercase tracking-widest leading-none">Active Demos</span>
            <span className="font-headline text-lg font-bold text-slate-900 mt-1">{demos.filter(d => d.status === 'Active').length} Total</span>
          </div>
          <div className="flex flex-col">
            <span className="font-sans text-[11px] font-bold text-slate-400 uppercase tracking-widest leading-none">Provisioning SLA</span>
            <span className="font-headline text-lg font-bold text-green-600 mt-1">99.98% High Precision</span>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <span className="font-sans text-xs text-slate-500">Page {page} of 1</span>
          <div className="flex items-center gap-1">
            <button 
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button 
              disabled={page === 1}
              className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Inspect Sandbox Details Modal */}
      {selectedDemo && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/30 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#0058be]" />
                <h3 className="font-headline text-base font-bold text-slate-900">Sandbox Blueprint</h3>
              </div>
              <button 
                onClick={() => setSelectedDemo(null)}
                className="p-1 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 font-sans text-xs text-slate-600">
              <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-400">Client Name</p>
                  <p className="font-headline text-sm font-bold text-slate-800 mt-1">{selectedDemo.clientName}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-400">Demo Code ID</p>
                  <p className="font-mono text-sm font-bold text-slate-800 mt-1">{selectedDemo.id}</p>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-[10px] uppercase font-bold text-slate-400">Access Emails & Preset Credentials</p>
                <div className="p-3 border border-slate-200 rounded-xl space-y-1 bg-white">
                  <div className="flex justify-between">
                    <span className="font-medium text-slate-500">Admin Email:</span>
                    <span className="font-bold text-slate-800">{selectedDemo.adminEmail}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-slate-500">Database Preset:</span>
                    <span className="font-semibold text-slate-800 capitalize">{selectedDemo.dataPreset}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-slate-500">Dual-Track Session:</span>
                    <span className={selectedDemo.sessionRecording ? 'text-green-600 font-bold' : 'text-slate-400'}>
                      {selectedDemo.sessionRecording ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-slate-500">GA4 Analytics Tag:</span>
                    <span className={selectedDemo.analyticsTracking ? 'text-green-600 font-bold' : 'text-slate-400'}>
                      {selectedDemo.analyticsTracking ? 'Connected' : 'Disconnected'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-[10px] uppercase font-bold text-slate-400">Container Telemetry Status</p>
                <div className="p-3 border border-slate-250 bg-slate-50 rounded-xl space-y-2">
                  <div className="flex justify-between text-xs">
                    <span>Virtual Hypervisor Node:</span>
                    <span className="font-bold text-slate-800">Cluster_Core_B</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span>Response Latency:</span>
                    <span className="font-mono text-green-600 font-bold">14ms average</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span>Database Health:</span>
                    <span className="font-bold text-slate-800">{selectedDemo.healthScore}% Operational</span>
                  </div>
                </div>
              </div>
            </div>

            <button 
              onClick={() => setSelectedDemo(null)}
              className="w-full py-2.5 mt-6 bg-[#0058be] hover:bg-[#004eab] text-white font-sans text-xs font-bold rounded-xl transition-colors uppercase tracking-wider"
            >
              Close Inspector
            </button>
          </div>
        </div>
      )}

      {/* Simulated Login Success Toast */}
      {simulatedLoginDetails && (
        <div className="fixed bottom-20 md:bottom-6 right-4 z-50 p-4 bg-slate-900 border border-slate-800 text-white rounded-2xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-6 max-w-[calc(100vw-2rem)] sm:max-w-sm">
          <div className="p-1 px-2.5 rounded-lg bg-blue-500 text-white text-xs font-bold">
            GA4
          </div>
          <div>
            <p className="text-xs font-bold">Bypassed Login Sequence</p>
            <p className="text-[10px] text-slate-400">Successfully locked credentials, loading dashboard frame of {simulatedLoginDetails}...</p>
          </div>
          <button 
            onClick={() => setSimulatedLoginDetails(null)}
            className="p-1 pl-3 text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
