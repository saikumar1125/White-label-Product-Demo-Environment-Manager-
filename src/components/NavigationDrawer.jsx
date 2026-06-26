import { LayoutGrid, Layers, PlusCircle, BarChart3, ShieldCheck, X } from 'lucide-react';

export default function NavigationDrawer({ activeTab, setActiveTab, isOpen, onClose, currentUser }) {
  const isAdmin = currentUser?.role === 'admin';
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutGrid },
    { id: 'environments', label: 'Environment Manager', icon: Layers },
    ...(isAdmin ? [{ id: 'create', label: 'New Instance', icon: PlusCircle }] : []),
    { id: 'analytics', label: 'Reports & Analytics', icon: BarChart3 },
  ];

  const handleNavClick = (id) => {
    setActiveTab(id);
    if (onClose) onClose(); // close drawer on mobile after selection
  };

  return (
    <>
      {/* Backdrop overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-30 bg-slate-900/40 backdrop-blur-[2px] lg:hidden"
          onClick={onClose}
        />
      )}

      <aside 
        className={`fixed top-16 left-0 h-[calc(100vh-64px)] z-40 bg-slate-50 border-r border-slate-200 w-64 transform transition-transform duration-250 lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } flex flex-col py-6`}
      >
        {/* Close button on mobile */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-1.5 rounded-lg hover:bg-slate-200 text-slate-500 transition-colors lg:hidden"
          aria-label="Close Navigation"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Partner header info context card */}
        <div className="px-6 mb-6">
          <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-slate-200/60 shadow-sm">
            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center border border-blue-100">
              <ShieldCheck className="w-6 h-6 text-[#0058be]" />
            </div>
            <div>
              <p className="font-headline text-sm font-bold text-slate-800 leading-tight">
                {isAdmin ? 'Expert Partner' : 'Client Partner'}
              </p>
              <p className="font-sans text-xs text-slate-500 truncate max-w-[120px]">
                {isAdmin ? 'brandsparkx Admin' : (currentUser?.clientName || 'Client Account')}
              </p>
            </div>
          </div>

        </div>

        {/* Navigation list */}
        <nav className="flex-1 px-3 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`flex items-center w-full gap-3 px-4 py-3 rounded-xl transition-all duration-150 ${
                  isActive
                    ? 'bg-blue-50 text-[#0058be] font-bold shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5px]' : 'stroke-[2px]'}`} />
                <span className="font-sans text-sm font-semibold">{item.label}</span>
              </button>
            );
          })}
        </nav>


      </aside>
    </>
  );
}
