import { useState, useTransition } from 'react';
import { 
  Database, 
  Key, 
  Layers, 
  Eye, 
  EyeOff, 
  Check, 
  Sparkles, 
  PlusCircle, 
} from 'lucide-react';

export default function CreateView({ onAddDemo, setActiveTab }) {
  // Form state
  const [productType, setProductType] = useState('');
  const [clientName, setClientName] = useState('');
  const [dataPreset, setDataPreset] = useState('empty');
  const [adminEmail, setAdminEmail] = useState('');
  const [password, setPassword] = useState('Sparkx2026!');
  const [showPassword, setShowPassword] = useState(false);
  const [expiryDate, setExpiryDate] = useState('');
  const [sessionRecording, setSessionRecording] = useState(false);
  const [analyticsTracking, setAnalyticsTracking] = useState(true);

  // Focus tracking for active design highlighting
  const [activeSection, setActiveSection] = useState(null);

  // Success modal state
  const [showModal, setShowModal] = useState(false);
  const [newDemoId, setNewDemoId] = useState('');

  // Submit flow
  const [isPending, startTransition] = useTransition();

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!productType || !clientName || !adminEmail) {
      alert("Please fill out all required fields.");
      return;
    }

    // Generate random Demo ID matching screenshots
    const initials = clientName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 3);
    const randomNum = Math.floor(10000 + Math.random() * 90000);
    const demoId = `DEMO-${randomNum}-${initials || 'DEMO'}`;
    setNewDemoId(demoId);

    // Map Product Labels
    const productLabels = {
      crm: 'Sales CRM (Alpha)',
      hrms: 'Custom HRMS (v4.2)',
      erp: 'E-Commerce ERP'
    };

    // Pick avatar design
    const bgColors = ['bg-blue-100', 'bg-orange-100', 'bg-purple-100', 'bg-green-100'];
    const textColors = ['text-blue-600', 'text-orange-600', 'text-purple-600', 'text-green-600'];
    const colorIndex = Math.floor(Math.random() * bgColors.length);

    const newDemo = {
      id: demoId,
      clientName: clientName,
      productType: productType,
      productLabel: productLabels[productType] || 'SaaS Portal',
      status: 'Provisioning',
      expiresAt: expiryDate ? new Date(expiryDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Never Expires',
      lastActivity: 'Just Now',
      adminEmail: adminEmail,
      dataPreset: dataPreset,
      sessionRecording: sessionRecording,
      analyticsTracking: analyticsTracking,
      healthScore: 100, // starts fully healthy
      loadState: 'In Progress',
      avatarInitials: initials.slice(0, 2) || 'CL',
      avatarBg: bgColors[colorIndex],
      avatarText: textColors[colorIndex]
    };

    // Trigger parent callback
    onAddDemo(newDemo);

    // Show success modal
    setShowModal(true);
  };

  const handleReturnToDashboard = () => {
    setShowModal(false);
    setActiveTab('dashboard');
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 pb-32 animate-in fade-in duration-200">


      {/* Right: Interactive Form Box */}
      <section className="flex-1 max-w-3xl">
        <div className="mb-6 sm:mb-8">
          <h1 className="font-headline text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Create New Instance
          </h1>
          <p className="font-sans text-sm text-slate-500 mt-1">
            Build and seed a white-label sandbox template for your upcoming customer interaction.
          </p>
        </div>

        <form onSubmit={handleFormSubmit} className="space-y-8">
          {/* Section 1: Product Details */}
          <div 
            className={`p-6 rounded-2xl bg-white border transition-all duration-300 ${
              activeSection === 1 
                ? 'border-l-4 border-l-[#0058be] border-slate-200/80 shadow-md pl-5' 
                : 'border-slate-200/60 shadow-sm'
            }`}
            onFocus={() => setActiveSection(1)}
            onBlur={() => setActiveSection(null)}
          >
            <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3 mb-5">
              <Layers className="w-5 h-5 text-[#0058be]" />
              <h3 className="font-headline text-base font-bold text-slate-800">1. Product Details</h3>
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="product_type" className="text-xs font-bold text-slate-500 uppercase tracking-wider flex justify-between">
                Select Platform Module
                <span className="text-red-500 font-semibold lowercase text-[10px]">* Required</span>
              </label>
              <select
                id="product_type"
                required
                className="w-full bg-white border border-slate-300 hover:border-slate-400 focus:border-[#0058be] focus:ring-1 focus:ring-[#0058be] rounded-xl px-4 py-3 text-sm font-sans text-slate-800 outline-none transition-all cursor-pointer"
                value={productType}
                onChange={(e) => setProductType(e.target.value)}
              >
                <option value="" disabled>Select an option</option>
                <option value="crm">CRM - Enterprise Relationship Suite</option>
                <option value="hrms">HRMS - Talent & Culture Portal</option>
                <option value="erp">ERP - Integrated Operations Core</option>
              </select>
            </div>
          </div>

          {/* Section 2: Client Data Seeding */}
          <div 
            className={`p-6 rounded-2xl bg-white border transition-all duration-300 ${
              activeSection === 2 
                ? 'border-l-4 border-l-[#0058be] border-slate-200/80 shadow-md pl-5' 
                : 'border-slate-200/60 shadow-sm'
            }`}
            onFocus={() => setActiveSection(2)}
            onBlur={() => setActiveSection(null)}
          >
            <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3 mb-5">
              <Database className="w-5 h-5 text-[#0058be]" />
              <h3 className="font-headline text-base font-bold text-slate-800">2. Client Data Seeding</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="flex flex-col gap-2">
                <label htmlFor="client_name" className="text-xs font-bold text-slate-500 uppercase tracking-wider flex justify-between">
                  Client Name
                  <span className="text-red-500 font-semibold lowercase text-[10px]">* Required</span>
                </label>
                <input
                  id="client_name"
                  type="text"
                  required
                  placeholder="e.g. Acme Corp Global"
                  className="bg-white border border-slate-300 hover:border-slate-400 focus:border-[#0058be] focus:ring-1 focus:ring-[#0058be] rounded-xl px-4 py-2.5 text-sm font-sans text-slate-800 placeholder-slate-400 outline-none transition-all"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="data_preset" className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Data Preset
                </label>
                <select
                  id="data_preset"
                  className="bg-white border border-slate-300 hover:border-slate-400 focus:border-[#0058be] focus:ring-1 focus:ring-[#0058be] rounded-xl px-4 py-3 text-sm font-sans text-slate-800 outline-none transition-all cursor-pointer"
                  value={dataPreset}
                  onChange={(e) => setDataPreset(e.target.value)}
                >
                  <option value="empty">Empty Canvas</option>
                  <option value="retail">Retail/Commerce (10k SKUs)</option>
                  <option value="fintech">Fintech Compliance (High Density)</option>
                  <option value="healthcare">Healthcare (HIPAA Synthetic Data)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 3: Access Credentials */}
          <div 
            className={`p-6 rounded-2xl bg-white border transition-all duration-300 ${
              activeSection === 3 
                ? 'border-l-4 border-l-[#0058be] border-slate-200/80 shadow-md pl-5' 
                : 'border-slate-200/60 shadow-sm'
            }`}
            onFocus={() => setActiveSection(3)}
            onBlur={() => setActiveSection(null)}
          >
            <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3 mb-5">
              <Key className="w-5 h-5 text-[#0058be]" />
              <h3 className="font-headline text-base font-bold text-slate-800">3. Access Credentials</h3>
            </div>

            <div className="space-y-4">
              <div className="flex flex-col gap-2">
                <label htmlFor="admin_email" className="text-xs font-bold text-slate-500 uppercase tracking-wider flex justify-between">
                  Admin Email Address
                  <span className="text-red-500 font-semibold lowercase text-[10px]">* Required</span>
                </label>
                <input
                  id="admin_email"
                  type="email"
                  required
                  placeholder="admin@brandsparkx.com"
                  className="bg-white border border-slate-300 hover:border-slate-400 focus:border-[#0058be] focus:ring-1 focus:ring-[#0058be] rounded-xl px-4 py-2.5 text-sm font-sans text-slate-800 placeholder-slate-400 outline-none transition-all"
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="flex flex-col gap-2">
                  <label htmlFor="password" className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Initial Password
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      className="w-full bg-white border border-slate-300 hover:border-slate-400 focus:border-[#0058be] focus:ring-1 focus:ring-[#0058be] rounded-xl px-4 py-2.5 pr-10 text-sm font-sans text-slate-800 outline-none transition-all"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#0058be] transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="expiry" className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Auto-Expiry Date
                  </label>
                  <input
                    id="expiry"
                    type="date"
                    className="bg-white border border-slate-300 hover:border-slate-400 focus:border-[#0058be] focus:ring-1 focus:ring-[#0058be] rounded-xl px-4 py-[9px] text-sm font-sans text-slate-800 outline-none transition-all cursor-pointer"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 4: Tracking Options */}
          <div 
            className={`p-6 rounded-2xl bg-white border transition-all duration-300 ${
              activeSection === 4 
                ? 'border-l-4 border-l-[#0058be] border-slate-200/80 shadow-md pl-5' 
                : 'border-slate-200/60 shadow-sm'
            }`}
            onFocus={() => setActiveSection(4)}
            onBlur={() => setActiveSection(null)}
          >
            <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3 mb-5">
              <Check className="w-5 h-5 text-[#0058be]" />
              <h3 className="font-headline text-base font-bold text-slate-800">4. Tracking Options</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="flex items-start gap-4 p-4 border border-slate-200/70 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors select-none">
                <input
                  type="checkbox"
                  className="accent-[#0058be] w-4 h-4 rounded mt-1 text-[#0058be]"
                  checked={sessionRecording}
                  onChange={(e) => setSessionRecording(e.target.checked)}
                />
                <div className="flex-1">
                  <p className="text-sm font-bold text-slate-800">Session Recording</p>
                  <p className="text-xs text-slate-400 font-medium leading-relaxed mt-0.5">
                    Record full user screen interactions safely inside client feedback logs.
                  </p>
                </div>
              </label>

              <label className="flex items-start gap-4 p-4 border border-slate-200/70 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors select-none">
                <input
                  type="checkbox"
                  className="accent-[#0058be] w-4 h-4 rounded mt-1 text-[#0058be]"
                  checked={analyticsTracking}
                  onChange={(e) => setAnalyticsTracking(e.target.checked)}
                />
                <div className="flex-1">
                  <p className="text-sm font-bold text-slate-800">Analytics Tracking</p>
                  <p className="text-xs text-slate-400 font-medium leading-relaxed mt-0.5">
                    Enable real-time Google Analytics 4 tracking tags in preview frame.
                  </p>
                </div>
              </label>
            </div>
          </div>

          <div className="h-10"></div>
        </form>
      </section>

      {/* Bottom Sticky Action Bar */}
      <footer className="fixed bottom-16 md:bottom-0 left-0 right-0 h-auto min-h-[72px] bg-white border-t border-slate-200 z-50 px-4 sm:px-6 py-3 sm:py-4 lg:left-64">
        <div className="max-w-[1100px] mx-auto flex flex-col sm:flex-row justify-between items-center gap-3">
          <div className="hidden sm:flex flex-col">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-none">Drafting: New Environment</span>
            <span className="text-xs text-[#0058be] font-bold mt-1">Unsaved parameters will not be persisted</span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button 
              type="button" 
              onClick={() => setActiveTab('dashboard')}
              className="flex-1 sm:flex-none px-4 sm:px-6 py-2.5 border border-slate-300 hover:bg-slate-50 text-slate-700 font-sans text-xs font-bold rounded-xl transition-colors uppercase tracking-wider"
            >
              Cancel
            </button>
            <button 
              type="button" 
              onClick={handleFormSubmit}
              disabled={isPending}
              className="flex-1 sm:flex-none px-4 sm:px-6 py-2.5 bg-[#0058be] hover:bg-[#004eab] text-white font-sans text-xs font-bold rounded-xl transition-colors uppercase tracking-wider shadow-md active:scale-95 duration-100"
            >
              Create Demo Environment
            </button>
          </div>
        </div>
      </footer>

      {/* Success Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/30 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl border border-slate-200/80 animate-in fade-in zoom-in-95 duration-200">
            <div className="w-14 h-14 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-5 border border-green-150">
              <Check className="w-8 h-8 stroke-[3px]" />
            </div>
            
            <h3 className="text-center font-headline text-lg font-bold text-slate-900 mb-2">
              Environment Initiated
            </h3>
            
            <p className="text-center text-slate-500 font-sans text-xs leading-relaxed mb-6">
              Provisioning of the <span className="font-semibold text-slate-800 uppercase">{productType} Demo</span> for "{clientName || 'Demo'}" has successfully started.
              The hypervisor container is propagating live under code <span className="font-mono bg-slate-100 text-[#0058be] px-1 rounded text-[11px] font-bold">{newDemoId}</span>.
            </p>

            <button 
              onClick={handleReturnToDashboard}
              className="w-full py-3 bg-[#0058be] hover:bg-[#004eab] text-white font-sans text-xs font-bold rounded-xl transition-colors uppercase tracking-wider shadow-md"
            >
              Return to Dashboard
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
