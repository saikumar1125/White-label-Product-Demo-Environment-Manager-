import { useState } from 'react';
import { 
  Layers, 
  CheckCircle, 
  Hourglass, 
  TrendingUp, 
  Activity, 
  ArrowRight, 
  PlusCircle, 
  Workflow, 
  Search, 
  SlidersHorizontal,
  ExternalLink,
  Zap,
  FileText
} from 'lucide-react';

export default function DashboardView({ demos, setActiveTab, onViewDetailedLogs, currentUser }) {
  const [filterQuery, setFilterQuery] = useState('');
  const isAdmin = currentUser?.role === 'admin';

  // Calculate stats dynamically based on custom state additions
  const activeCount = demos.filter(d => d.status === 'Active').length;
  const provisioningCount = demos.filter(d => d.status === 'Provisioning').length;

  const totalDemosCount = isAdmin ? (1284 - 6 + demos.length) : demos.length;
  const activeDemosCount = isAdmin ? (842 - 4 + activeCount) : activeCount;
  const pendingDemosCount = isAdmin ? (23 - 1 + provisioningCount) : provisioningCount;

  // Filter recently listed demos
  const filteredDemos = demos.filter(demo => 
    demo.clientName.toLowerCase().includes(filterQuery.toLowerCase()) ||
    demo.id.toLowerCase().includes(filterQuery.toLowerCase()) ||
    demo.productLabel.toLowerCase().includes(filterQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Welcome Hero Area */}
      <section className="flex flex-col gap-1.5 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="font-headline text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-slate-900">
            Welcome back, {isAdmin ? 'Partner' : (currentUser?.name || 'Client')}
          </h1>
          <p className="font-sans text-sm md:text-base text-slate-500 max-w-2xl">
            Here is the latest live status and hypervisor telemetry of {isAdmin ? 'your white-label demo environments' : 'your active sandbox environment'}.
          </p>
        </div>
        

      </section>

      {/* Summary Metrics Cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Total Demos Card */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm hover:shadow-md transition-all duration-200 group">
          <div className="flex justify-between items-start mb-4">
            <span className="font-sans text-xs font-bold text-slate-400 uppercase tracking-widest">
              Total Demos
            </span>
            <div className="p-2 bg-blue-50 text-[#0058be] rounded-lg group-hover:bg-blue-100 transition-colors">
              <Layers className="w-5 h-5 stroke-[2px]" />
            </div>
          </div>
          <div className="font-headline text-3xl font-bold text-slate-900 tabular-nums">
            {totalDemosCount.toLocaleString()}
          </div>
          <div className="mt-3 flex items-center gap-1 text-xs font-semibold text-green-600">
            <TrendingUp className="w-4.5 h-4.5" />
            <span>+12% from last month</span>
          </div>
        </div>

        {/* Active Environments */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm hover:shadow-md transition-all duration-200 group">
          <div className="flex justify-between items-start mb-4">
            <span className="font-sans text-xs font-bold text-slate-400 uppercase tracking-widest">
              Active Environments
            </span>
            <div className="p-2 bg-green-50 text-green-600 rounded-lg group-hover:bg-green-100 transition-colors">
              <CheckCircle className="w-5 h-5 stroke-[2px]" />
            </div>
          </div>
          <div className="font-headline text-3xl font-bold text-slate-900 tabular-nums">
            {activeDemosCount}
          </div>
          <div className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-blue-600">
            <Zap className="w-4 h-4 fill-blue-600" />
            <span>94% average Uptime</span>
          </div>
        </div>

        {/* Pending Seedings */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm hover:shadow-md transition-all duration-200 group">
          <div className="flex justify-between items-start mb-4">
            <span className="font-sans text-xs font-bold text-slate-400 uppercase tracking-widest">
              Pending Seedings
            </span>
            <div className="p-2 bg-amber-50 text-amber-600 rounded-lg group-hover:bg-amber-100 transition-colors">
              <Hourglass className="w-5 h-5 stroke-[2px]" />
            </div>
          </div>
          <div className="font-headline text-3xl font-bold text-slate-900 tabular-nums">
            {pendingDemosCount}
          </div>
          <div className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-slate-500">
            <Workflow className="w-4 h-4 text-slate-400" />
            <span>5 Ready in 10m</span>
          </div>
        </div>
      </section>

      {/* Bento Grid layout containing Environment Health and Launch Instance / Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Environment Health (Bento Span 8) */}
        <section className="lg:col-span-8 bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="font-headline text-lg font-bold text-slate-900">
                Environment Health
              </h2>
              <p className="text-xs text-slate-400 font-sans mt-0.5">Real-time health scores by service catalog</p>
            </div>
            <button 
              onClick={onViewDetailedLogs}
              className="text-[#0058be] font-sans text-xs font-bold hover:underline flex items-center gap-1"
            >
              View Detailed Logs 
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* CRM Health card */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/40 flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <span className="font-sans text-xs font-bold text-slate-700">CRM Cluster</span>
              </div>
              <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                <div className="bg-green-500 h-full w-[98.4%]" />
              </div>
              <span className="text-[11px] font-semibold text-slate-500">98.4% Health Score</span>
            </div>

            {/* HRMS Health card */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/40 flex flex-col gap-3">
              <div className="flex items-center gap-2 font-semibold">
                <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                <span className="font-sans text-xs font-bold text-slate-700">HRMS Cluster</span>
              </div>
              <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                <div className="bg-amber-400 h-full w-[72%]" />
              </div>
              <span className="text-[11px] font-semibold text-amber-600 font-sans">72.1% High Load</span>
            </div>

            {/* ERP Health card */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/40 flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <span className="font-sans text-xs font-bold text-slate-700">ERP Cluster</span>
              </div>
              <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                <div className="bg-green-500 h-full w-[94.8%]" />
              </div>
              <span className="text-[11px] font-semibold text-slate-500">94.8% Operational</span>
            </div>
          </div>
        </section>

        {/* Quick Actions (Bento Span 4) */}
        <section className="lg:col-span-4 flex flex-col gap-4">
          <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-sm flex flex-col justify-between h-full min-h-[200px] relative overflow-hidden">
            <div className="absolute right-[-20px] top-[-20px] w-28 h-28 bg-[#0058be]/20 rounded-full blur-2xl"></div>
            {isAdmin ? (
              <>
                <div>
                  <h3 className="font-headline text-lg font-bold text-white mb-1">
                    Launch Instance
                  </h3>
                  <p className="font-sans text-xs text-slate-400">
                    Deploy a brand new, pre-seeded sandbox demo for client presentations in seconds.
                  </p>
                </div>
                
                <button 
                  onClick={() => setActiveTab('create')}
                  className="bg-[#0058be] hover:bg-[#004eab] transition-all text-white font-sans text-xs font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 mt-4 cursor-pointer scale-100 active:scale-95 shadow-md"
                >
                  <PlusCircle className="w-4 h-4 fill-white text-[#0058be]" />
                  Create New Demo
                </button>
              </>
            ) : (
              <>
                <div>
                  <h3 className="font-headline text-lg font-bold text-white mb-1">
                    Client Sandbox Portal
                  </h3>
                  <p className="font-sans text-xs text-slate-400">
                    Access your live SaaS sandbox environments, retrieve preset credentials, and run compliance audits.
                  </p>
                </div>
                
                <button 
                  onClick={() => setActiveTab('environments')}
                  className="bg-[#0058be] hover:bg-[#004eab] transition-all text-white font-sans text-xs font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 mt-4 cursor-pointer scale-100 active:scale-95 shadow-md"
                >
                  <Workflow className="w-4 h-4 fill-white text-[#0058be]" />
                  Manage My Sandbox
                </button>
              </>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button 
              onClick={onViewDetailedLogs}
              className="bg-white border border-slate-200/60 p-4 rounded-xl hover:bg-slate-50 transition-colors flex flex-col items-center justify-center gap-2 text-center shadow-sm"
            >
              <Activity className="w-5 h-5 text-[#0058be]" />
              <span className="font-sans text-xs font-bold text-slate-700">Track Session</span>
            </button>
            <button 
              onClick={() => {
                const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
                  JSON.stringify(demos, null, 2)
                )}`;
                const downloadAnchor = document.createElement('a');
                downloadAnchor.setAttribute('href', jsonString);
                downloadAnchor.setAttribute('download', 'brandsparkx_demos_report.json');
                document.body.appendChild(downloadAnchor);
                downloadAnchor.click();
                downloadAnchor.remove();
              }}
              className="bg-white border border-slate-200/60 p-4 rounded-xl hover:bg-slate-50 transition-colors flex flex-col items-center justify-center gap-2 text-center shadow-sm"
              title="Download environment report JSON"
            >
              <FileText className="w-5 h-5 text-[#0058be]" />
              <span className="font-sans text-xs font-bold text-slate-700">Gen Report</span>
            </button>
          </div>
        </section>
      </div>

      {/* Recent Demos List/Table (Bento Span 12) */}
      <section className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-200/60 flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
          <div>
            <h2 className="font-headline text-lg font-bold text-slate-900">
              Recent Demos
            </h2>
            <p className="text-xs text-slate-400 font-sans mt-0.5">List of newly generated sandboxes across all segments</p>
          </div>
          
          <div className="flex gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-48">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                className="w-full bg-slate-50 border border-slate-200 rounded-full py-1.5 pl-9 pr-4 text-xs font-sans outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white transition-all text-slate-700 placeholder-slate-400" 
                placeholder="Filter clients..." 
                type="text"
                value={filterQuery}
                onChange={(e) => setFilterQuery(e.target.value)}
              />
            </div>
            <button 
              onClick={() => setActiveTab('environments')}
              className="p-1.5 border border-slate-200 rounded-full hover:bg-slate-50 text-slate-500 hover:text-slate-700 transition-colors"
              title="Advanced Filter Settings"
            >
              <SlidersHorizontal className="w-4.5 h-4.5" />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          {filteredDemos.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-slate-400 font-sans text-sm">No recent demos matching "{filterQuery}"</p>
            </div>
          ) : (
            <>
              {/* Mobile card list (visible below sm) */}
              <div className="sm:hidden divide-y divide-slate-100">
                {filteredDemos.map((demo) => {
                  const statusColors = {
                    Active: 'bg-green-50 text-green-700 border-green-200',
                    Provisioning: 'bg-blue-50 text-blue-700 border-blue-200',
                    Expired: 'bg-slate-50 text-slate-500 border-slate-200'
                  };
                  return (
                    <div key={demo.id} className="p-4 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`w-9 h-9 rounded-xl ${demo.avatarBg} ${demo.avatarText} font-headline flex items-center justify-center font-bold text-sm shadow-sm shrink-0`}>
                          {demo.avatarInitials}
                        </div>
                        <div className="min-w-0">
                          <div className="font-sans text-sm font-semibold text-slate-900 truncate">{demo.clientName}</div>
                          <div className="font-mono text-[10px] text-slate-400">#{demo.id}</div>
                          <span className="inline-flex mt-1 items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border
                            " style={{}} >{demo.productLabel}</span>
                        </div>
                      </div>
                      <span className={`shrink-0 inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider border ${statusColors[demo.status]}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          demo.status === 'Active' ? 'bg-green-600' :
                          demo.status === 'Provisioning' ? 'bg-blue-600 animate-pulse' : 'bg-slate-400'
                        }`} />
                        {demo.status === 'Provisioning' ? 'Deploying' : demo.status}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Desktop table (visible sm and above) */}
              <table className="hidden sm:table w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 font-sans uppercase text-[10px] tracking-wider font-bold">
                    <th className="px-6 py-3.5">Client Name</th>
                    <th className="px-6 py-3.5">Product</th>
                    <th className="px-6 py-3.5">Last Activity</th>
                    <th className="px-6 py-3.5">Status</th>
                    <th className="px-6 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredDemos.map((demo) => {
                    const statusColors = {
                      Active: 'bg-green-50 text-green-700 border-green-200',
                      Provisioning: 'bg-blue-50 text-blue-700 border-blue-200',
                      Expired: 'bg-slate-50 text-slate-5050 border-slate-200'
                    };

                    return (
                      <tr key={demo.id} className="hover:bg-slate-50/50 transition-colors group">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className={`w-9 h-9 rounded-xl ${demo.avatarBg} ${demo.avatarText} font-headline flex items-center justify-center font-bold text-sm shadow-sm`}>
                              {demo.avatarInitials}
                            </div>
                            <div>
                              <div className="font-sans text-sm font-semibold text-slate-900">
                                {demo.clientName}
                              </div>
                              <div className="font-mono text-[11px] text-slate-400">
                                ID: #{demo.id}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-sans text-xs text-slate-600 font-medium bg-slate-100 py-1 px-2.5 rounded-lg border border-slate-200/20">
                            {demo.productLabel}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-mono text-xs text-slate-500">
                          {demo.lastActivity}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${statusColors[demo.status]}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${
                              demo.status === 'Active' ? 'bg-green-600' :
                              demo.status === 'Provisioning' ? 'bg-blue-600 animate-pulse' : 'bg-slate-400'
                            }`} />
                            {demo.status === 'Provisioning' ? 'Deploying' : demo.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button 
                            onClick={() => setActiveTab('environments')}
                            className="p-1 px-2 rounded hover:bg-white border border-transparent hover:border-slate-200 text-slate-400 group-hover:text-[#0058be] transition-colors inline-flex items-center gap-1.5 text-xs font-semibold"
                          >
                            <span className="hidden sm:inline">Manage</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
