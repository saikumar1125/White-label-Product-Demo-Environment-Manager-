import { User, Shield, Activity, Users, Settings, Database, Server } from 'lucide-react';

export default function AdminPortalView({ currentUser }) {
  // Mock data for the admin portal
  const systemMetrics = [
    { label: 'API Health', value: '99.99%', status: 'optimal', icon: Activity },
    { label: 'Active Clusters', value: '12 / 50', status: 'normal', icon: Server },
    { label: 'Storage Usage', value: '8.4 TB', status: 'warning', icon: Database }
  ];

  const registeredPartners = [
    { name: 'Global Dynamics Corp', email: 'admin@gdc.com', role: 'Client', status: 'Active', joined: 'Oct 12, 2025' },
    { name: 'Velocity Fintech', email: 'systems@velocity.io', role: 'Client', status: 'Active', joined: 'Nov 05, 2025' },
    { name: 'EcoStrata Solutions', email: 'training@ecostrata.org', role: 'Client', status: 'Pending', joined: 'Today' }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-200 pb-32">
      {/* Header */}
      <div>
        <h1 className="font-headline text-3xl font-bold tracking-tight text-slate-900">
          Admin Portal
        </h1>
        <p className="font-sans text-sm text-slate-500 mt-1">
          Manage your account settings, monitor system health, and oversee partner access.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: User Details */}
        <div className="col-span-1 space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-100">
              <div className="w-16 h-16 rounded-full bg-blue-50 border border-blue-150 flex items-center justify-center text-[#0058be] font-headline text-2xl font-bold shadow-sm">
                {currentUser?.name ? currentUser.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'A'}
              </div>
              <div>
                <h2 className="font-bold text-lg text-slate-900">{currentUser?.name || 'BrandSparkX Admin'}</h2>
                <p className="text-sm text-slate-500">{currentUser?.email || 'admin@brandsparkx.com'}</p>
                <div className="mt-2 inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-blue-50 text-[#0058be] border border-blue-150">
                  <Shield className="w-3 h-3" />
                  {currentUser?.role || 'Admin'} Access
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Account Details</h3>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500">Account ID</span>
                <span className="font-mono text-slate-800 font-semibold">{currentUser?.id || 'USR-99281-AD'}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500">2FA Status</span>
                <span className="text-green-600 font-semibold flex items-center gap-1"><Shield className="w-3.5 h-3.5"/> Enabled</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500">Last Login</span>
                <span className="text-slate-800 font-semibold">Just now</span>
              </div>
            </div>
            
            <button className="w-full mt-6 py-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-sm font-bold rounded-xl transition-colors flex items-center justify-center gap-2">
              <Settings className="w-4 h-4" />
              Edit Profile Settings
            </button>
          </div>
        </div>

        {/* Right Column: System & Users */}
        <div className="col-span-1 lg:col-span-2 space-y-6">
          {/* System Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {systemMetrics.map((metric, idx) => {
              const Icon = metric.icon;
              return (
                <div key={idx} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <div className={`p-2 rounded-lg ${
                      metric.status === 'optimal' ? 'bg-green-50 text-green-600' :
                      metric.status === 'warning' ? 'bg-amber-50 text-amber-600' :
                      'bg-blue-50 text-[#0058be]'
                    }`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{metric.label}</span>
                  </div>
                  <p className="font-headline text-2xl font-bold text-slate-900">{metric.value}</p>
                </div>
              );
            })}
          </div>

          {/* Registered Partners Table */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Users className="w-5 h-5 text-[#0058be]" />
                <h3 className="font-headline text-base font-bold text-slate-800">Partner Accounts Directory</h3>
              </div>
              <button className="text-xs font-bold text-[#0058be] hover:text-[#004eab] transition-colors">
                View All
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    <th className="px-5 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Partner Organization</th>
                    <th className="px-5 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Role</th>
                    <th className="px-5 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Status</th>
                    <th className="px-5 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider hidden sm:table-cell">Joined</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 text-sm">
                  {registeredPartners.map((partner, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-5 py-4">
                        <p className="font-bold text-slate-800">{partner.name}</p>
                        <p className="text-xs text-slate-500">{partner.email}</p>
                      </td>
                      <td className="px-5 py-4">
                        <span className="inline-flex px-2 py-0.5 rounded text-[10px] font-extrabold uppercase border bg-slate-100 text-slate-600 border-slate-200">
                          {partner.role}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          partner.status === 'Active' ? 'text-green-600 bg-green-50' : 'text-amber-600 bg-amber-50'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${partner.status === 'Active' ? 'bg-green-500' : 'bg-amber-500'}`} />
                          {partner.status}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-slate-500 font-medium hidden sm:table-cell">
                        {partner.joined}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
