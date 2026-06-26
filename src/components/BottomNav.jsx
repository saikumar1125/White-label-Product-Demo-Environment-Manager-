import { LayoutGrid, Layers, PlusCircle, BarChart3 } from 'lucide-react';

export default function BottomNav({ activeTab, setActiveTab, currentUser }) {
  const isAdmin = currentUser?.role === 'admin';
  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutGrid },
    { id: 'environments', label: 'Environments', icon: Layers },
    ...(isAdmin ? [{ id: 'create', label: 'Create', icon: PlusCircle }] : []),
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex justify-around items-center h-16 bg-white border-t border-slate-200 px-2 pb-safe shadow-lg md:hidden">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all duration-150 ${
              isActive
                ? 'bg-blue-50 text-[#0058be] font-bold scale-95'
                : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
            }`}
          >
            <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5px]' : 'stroke-[2px]'}`} />
            <span className="font-sans text-[11px] font-semibold mt-1">{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
