import { useState } from 'react';
import { 
  TrendingUp, 
  CheckCircle2, 
  DownloadCloud
} from 'lucide-react';

export default function AnalyticsView({ demos, currentUser }) {
  const [timeRange, setTimeRange] = useState('7');
  const [hoveredPoint, setHoveredPoint] = useState(null);
  const isAdmin = currentUser?.role === 'admin';

  // Sample data coordinates for Monthly Demo Growth SVG paths
  const chartData = {
    '7': isAdmin ? [
      { week: 'Week 1', value: 310, x: 20, y: 70 },
      { week: 'Week 2', value: 485, x: 140, y: 55 },
      { week: 'Week 3', value: 720, x: 260, y: 38 },
      { week: 'Week 4', value: 1240, x: 380, y: 15 }
    ] : [
      { week: 'Week 1', value: 3, x: 20, y: 80 },
      { week: 'Week 2', value: 8, x: 140, y: 65 },
      { week: 'Week 3', value: 12, x: 260, y: 45 },
      { week: 'Week 4', value: 15, x: 380, y: 25 }
    ],
    '30': isAdmin ? [
      { week: 'Week 1', value: 180, x: 20, y: 85 },
      { week: 'Week 2', value: 520, x: 140, y: 48 },
      { week: 'Week 3', value: 980, x: 260, y: 24 },
      { week: 'Week 4', value: 1640, x: 380, y: 8 }
    ] : [
      { week: 'Week 1', value: 10, x: 20, y: 85 },
      { week: 'Week 2', value: 25, x: 140, y: 60 },
      { week: 'Week 3', value: 38, x: 260, y: 35 },
      { week: 'Week 4', value: 45, x: 380, y: 15 }
    ],
  };

  const currentPoints = timeRange === 'custom' ? chartData['7'] : chartData[timeRange];

  const pathD = `M ${currentPoints[0].x} ${currentPoints[0].y} 
                 C 80 ${currentPoints[0].y - 5}, 100 ${currentPoints[1].y + 5}, ${currentPoints[1].x} ${currentPoints[1].y}
                 C 200 ${currentPoints[1].y - 5}, 220 ${currentPoints[2].y + 5}, ${currentPoints[2].x} ${currentPoints[2].y}
                 C 320 ${currentPoints[2].y - 5}, 340 ${currentPoints[3].y + 5}, ${currentPoints[3].x} ${currentPoints[3].y}`;

  const areaD = `${pathD} L 380 90 L 20 90 Z`;

  // Calculate Product distribution dynamically
  const crmCount = demos.filter(d => d.productType === 'crm').length;
  const hrmsCount = demos.filter(d => d.productType === 'hrms').length;
  const erpCount = demos.filter(d => d.productType === 'erp').length;
  const totalRaw = crmCount + hrmsCount + erpCount;

  const crmPercentage = Math.round((crmCount / (totalRaw || 1)) * 100);
  const hrmsPercentage = Math.round((hrmsCount / (totalRaw || 1)) * 100);
  const erpPercentage = Math.round((erpCount / (totalRaw || 1)) * 100);

  // Trigger JSON report export
  const handleExportCSV = () => {
    let csvContent = 'data:text/csv;charset=utf-8,';
    csvContent += 'ID,Client Name,Product Module,Status,Expiry Date,Health Score\r\n';
    demos.forEach((d) => {
      csvContent += `"${d.id}","${d.clientName}","${d.productLabel}","${d.status}","${d.expiresAt}",${d.healthScore}\r\n`;
    });
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'brandsparkx_demo_analytics.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 pb-32 animate-in fade-in duration-200">
      
      {/* Top Title Section */}
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="font-sans text-[11px] font-bold text-[#0058be] uppercase tracking-widest leading-none mb-1">
            Insights Engine
          </p>
          <h2 className="font-headline text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Reports &amp; Analytics
          </h2>
        </div>

        {/* Date Ranges Filters matching layout */}
        <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 p-1 rounded-xl w-fit">
          <button 
            onClick={() => setTimeRange('7')}
            className={`px-3 sm:px-4 py-1.5 rounded-lg text-[11px] sm:text-xs font-bold transition-all ${
              timeRange === '7' 
                ? 'bg-white text-[#0058be] shadow-sm' 
                : 'text-slate-500 hover:text-slate-805'
            }`}
          >
            7 Days
          </button>
          <button 
            onClick={() => setTimeRange('30')}
            className={`px-3 sm:px-4 py-1.5 rounded-lg text-[11px] sm:text-xs font-bold transition-all ${
              timeRange === '30' 
                ? 'bg-white text-[#0058be] shadow-sm' 
                : 'text-slate-500 hover:text-slate-805'
            }`}
          >
            30 Days
          </button>
          <button 
            onClick={() => setTimeRange('custom')}
            className={`px-3 sm:px-4 py-1.5 rounded-lg text-[11px] sm:text-xs font-bold transition-all ${
              timeRange === 'custom' 
                ? 'bg-white text-[#0058be] shadow-sm' 
                : 'text-slate-500 hover:text-slate-805'
            }`}
          >
            Custom
          </button>
        </div>
      </div>

      {/* Grid: Line Chart and Success Rate Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Monthly Demo Growth Card (Span 8) */}
        <div className="lg:col-span-8 bg-white border border-slate-200/60 rounded-2xl p-6 flex flex-col h-[260px] sm:h-[340px] relative overflow-hidden shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="font-headline text-lg font-bold text-slate-900">Monthly Demo Growth</h3>
              <p className="text-xs text-slate-400 font-sans mt-0.5">Live tracking of active provisioned sandboxes</p>
            </div>
            <span className="bg-green-50 text-green-700 border border-green-200 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" /> 
              +14.2%
            </span>
          </div>

          {/* Styled SVG Chart */}
          <div className="flex-1 w-full relative mt-4 border-l border-b border-slate-100/80">
            {/* Grid dots background pattern */}
            <div className="absolute inset-0 grid grid-cols-6 grid-rows-4 opacity-[0.06] pointer-events-none">
              {Array.from({ length: 24 }).map((_, i) => (
                <div key={i} className="border-r border-b border-dashed border-slate-900 w-full h-full"></div>
              ))}
            </div>

            <svg className="w-full h-full" viewBox="0 0 400 100" preserveAspectRatio="none">
              <defs>
                <linearGradient id="chart-area-grad" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#2170e4" stopOpacity="0.25"></stop>
                  <stop offset="100%" stopColor="#2170e4" stopOpacity="0"></stop>
                </linearGradient>
              </defs>

              {/* Area path */}
              <path d={areaD} fill="url(#chart-area-grad)"></path>

              {/* Stroke path */}
              <path d={pathD} fill="none" stroke="#0058be" strokeWidth="2.5" strokeLinecap="round"></path>

              {/* Data Interactive circles */}
              {currentPoints.map((pt, idx) => (
                <g key={pt.week} className="cursor-pointer">
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r={hoveredPoint === idx ? 6 : 4}
                    fill="#0058be"
                    stroke="#ffffff"
                    strokeWidth="1.5"
                    onMouseEnter={() => setHoveredPoint(idx)}
                    onMouseLeave={() => setHoveredPoint(null)}
                    className="transition-all duration-100"
                  />
                </g>
              ))}
            </svg>

            {/* Simulated Live Tooltips */}
            {hoveredPoint !== null && (
              <div 
                className="absolute bg-slate-900 text-white rounded-lg p-2.5 shadow-xl text-center space-y-0.5 border border-slate-800 transition-all font-sans -translate-x-1/2 -translate-y-full"
                style={{ 
                  left: `${(currentPoints[hoveredPoint].x / 400) * 100}%`,
                  top: `${(currentPoints[hoveredPoint].y / 100) * 100 - 8}%`
                }}
              >
                <p className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">
                  {currentPoints[hoveredPoint].week}
                </p>
                <p className="text-sm font-bold">
                  {currentPoints[hoveredPoint].value.toLocaleString()} nodes
                </p>
              </div>
            )}
            
            {/* Axis grid labels */}
            <div className="absolute left-1 top-0 h-full flex flex-col justify-between py-2 text-[10px] font-mono text-slate-400 select-none">
              <span>{isAdmin ? (timeRange === '30' ? '1.5k' : '1.2k') : (timeRange === '30' ? '50' : '20')}</span>
              <span>{isAdmin ? '500' : '10'}</span>
              <span>0</span>
            </div>
          </div>

          <div className="flex justify-between text-[11px] font-bold text-slate-400 mt-3 px-6 select-none font-sans">
            <span>Week 1</span>
            <span>Week 2</span>
            <span>Week 3</span>
            <span>Week 4</span>
          </div>
        </div>

        {/* Demo Success Rate Indicator (Span 4) */}
        <div className="lg:col-span-4 bg-slate-950 text-white rounded-2xl p-6 flex flex-col justify-between relative overflow-hidden shadow-sm h-[340px]">
          <div className="absolute top-0 right-0 w-36 h-36 bg-blue-600/10 rounded-full blur-3xl select-none"></div>
          <div>
            <h3 className="font-headline text-lg font-bold text-slate-400">Demo Success Rate</h3>
            <p className="text-xs text-slate-5050 font-sans mt-0.5">Regional health &amp; cloud instance availability index</p>
            
            <div className="mt-8 flex items-baseline gap-1">
              <span className="text-6xl font-headline font-bold text-white tracking-tight">98.4</span>
              <span className="text-2xl text-blue-400 font-semibold">%</span>
            </div>
            <p className="text-xs text-slate-400 font-medium font-sans mt-1">SLA cluster performance SLA high target achieved</p>
          </div>

          <div className="mt-auto">
            <div className="h-2.5 w-full bg-slate-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 to-[#0058be] rounded-full shadow-[0_0_12px_rgba(33,112,228,0.5)] transition-all duration-305" 
                style={{ width: '98.4%' }}
              />
            </div>
            <div className="flex justify-between mt-3 text-xs font-bold font-sans">
              <span className="text-slate-500">Target Target: 95%</span>
              <span className="text-green-400 tracking-wider">EXCELLENT</span>
            </div>
          </div>
        </div>

      </div>

      {/* Grid: Product Distribution and Top Clients */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Product Distribution Donut (Span 5) */}
        <div className="lg:col-span-5 bg-white border border-slate-200/60 rounded-2xl p-6 flex flex-col justify-between shadow-sm">
          <div>
            <h3 className="font-headline text-lg font-bold text-slate-900">Product Distribution</h3>
            <p className="text-xs text-slate-400 font-sans mt-0.5">Demographics by subscription module segments</p>
          </div>

          {/* Beautiful Custom SVG Donut Component */}
          <div className="flex items-center justify-center py-6 relative">
            <svg className="w-40 h-44 transform -rotate-90">
              <circle cx="80" cy="80" r="64" fill="transparent" stroke="#f1f5f9" strokeWidth="16"></circle>
              <circle 
                cx="80" cy="80" r="64" fill="transparent" 
                stroke="#0058be" strokeWidth="16"
                strokeDasharray="402" strokeDashoffset="180" 
                strokeLinecap="round"
                className="transition-all duration-500"
              ></circle>
              <circle 
                cx="80" cy="80" r="64" fill="transparent" 
                stroke="#2170e4" strokeWidth="16"
                strokeDasharray="402" strokeDashoffset="310" 
                strokeLinecap="round"
                className="transition-all duration-500"
              ></circle>
            </svg>
            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className="font-headline text-2xl font-bold text-slate-900">
                {(demos.length + 1234).toLocaleString()}
              </span>
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">Instances</span>
            </div>
          </div>

          {/* Legends with dynamic percentages */}
          <div className="space-y-2 mt-2">
            <div className="flex items-center justify-between p-2 hover:bg-slate-50 rounded-lg transition-colors border border-transparent">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#0058be]" />
                <span className="text-xs font-semibold text-slate-700">CRM Relationship Suite</span>
              </div>
              <span className="font-mono text-xs font-bold text-slate-800">{crmPercentage ? crmPercentage : 55}%</span>
            </div>
            
            <div className="flex items-center justify-between p-2 hover:bg-slate-50 rounded-lg transition-colors">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#2170e4]" />
                <span className="text-xs font-semibold text-slate-700">HRMS Talent Portal</span>
              </div>
              <span className="font-mono text-xs font-bold text-slate-800">{hrmsPercentage ? hrmsPercentage : 30}%</span>
            </div>

            <div className="flex items-center justify-between p-2 hover:bg-slate-50 rounded-lg transition-colors">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-slate-200" />
                <span className="text-xs font-semibold text-slate-700">ERP Unified Operations</span>
              </div>
              <span className="font-mono text-xs font-bold text-slate-800">{erpPercentage ? erpPercentage : 15}%</span>
            </div>
          </div>
        </div>

        {/* Top Clients List or My Sandbox Resources (Span 7) */}
        <div className="lg:col-span-7 bg-white border border-slate-200/60 rounded-2xl p-6 flex flex-col justify-between shadow-sm">
          {isAdmin ? (
            <>
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="font-headline text-lg font-bold text-slate-900">Top Clients</h3>
                  <p className="text-xs text-slate-400 font-sans mt-0.5">Most active demo sandboxes of this cycle</p>
                </div>
                <button className="text-[#0058be] font-sans text-xs font-bold hover:underline">
                  View All
                </button>
              </div>

              <div className="space-y-3 flex-1 flex flex-col justify-center">
                {/* Row 1 */}
                <div className="group flex items-center justify-between p-3.5 bg-slate-50 hover:bg-slate-100 border border-transparent hover:border-slate-200 hover:shadow-sm transition-all rounded-xl cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center border border-slate-200 font-headline font-bold text-[#0058be] text-sm">
                      NT
                    </div>
                    <div>
                      <h4 className="font-sans text-sm font-bold text-slate-800">NexusTech Global</h4>
                      <p className="text-[11px] text-slate-400 font-medium">Global Enterprise SaaS Tier</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-mono text-xs font-bold text-slate-800">482 Sessions</p>
                    <p className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100 mt-1 w-fit ml-auto">Active Now</p>
                  </div>
                </div>

                {/* Row 2 */}
                <div className="group flex items-center justify-between p-3.5 bg-slate-50 hover:bg-slate-100 border border-transparent hover:border-slate-200 hover:shadow-sm transition-all rounded-xl cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center border border-slate-200 font-headline font-bold text-amber-600 text-sm">
                      SL
                    </div>
                    <div>
                      <h4 className="font-sans text-sm font-bold text-slate-800">SkyLine Systems</h4>
                      <p className="text-[11px] text-slate-400 font-medium">Standard Integration Partner</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-mono text-xs font-bold text-slate-800">310 Sessions</p>
                    <p className="text-[10px] text-slate-400 font-bold mt-1">Peak load: 4 PM</p>
                  </div>
                </div>

                {/* Row 3 */}
                <div className="group flex items-center justify-between p-3.5 bg-slate-50 hover:bg-slate-100 border border-transparent hover:border-slate-200 hover:shadow-sm transition-all rounded-xl cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center border border-slate-200 font-headline font-bold text-purple-600 text-sm">
                      VF
                    </div>
                    <div>
                      <h4 className="font-sans text-sm font-bold text-slate-800">Vanguard Finance</h4>
                      <p className="text-[11px] text-slate-400 font-medium">Premium Financial Portal</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-mono text-xs font-bold text-slate-800">295 Sessions</p>
                    <p className="text-[10px] text-blue-600 font-bold bg-blue-50 px-1.5 py-0.5 rounded border border-blue-100 mt-1 w-fit ml-auto">Uptime: 100%</p>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="font-headline text-lg font-bold text-slate-900">Sandbox Resource Telemetry</h3>
                  <p className="text-xs text-slate-400 font-sans mt-0.5">Live hypervisor node usage mapping</p>
                </div>
                <span className="text-emerald-600 font-sans text-xs font-bold flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-ping" />
                  All healthy
                </span>
              </div>

              <div className="space-y-3 flex-1 flex flex-col justify-center">
                {demos.map((d) => (
                  <div key={d.id} className="group flex items-center justify-between p-3.5 bg-slate-50 hover:bg-slate-100 border border-transparent hover:border-slate-200 transition-all rounded-xl cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 ${d.avatarBg || 'bg-blue-50'} ${d.avatarText || 'text-[#0058be]'} rounded-lg flex items-center justify-center font-headline font-bold text-sm`}>
                        {d.avatarInitials || d.clientName.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <h4 className="font-sans text-sm font-bold text-slate-800">{d.productLabel}</h4>
                        <p className="text-[11px] text-slate-400 font-medium font-mono">ID: #{d.id}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-mono text-xs font-bold text-slate-800">{d.healthScore}% Health Score</p>
                      <p className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100 mt-1 w-fit ml-auto">
                        {d.loadState || 'Operational'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

      </div>

      {/* System Health Small Status Banner */}
      <div className="bg-slate-100/60 border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          <span className="font-sans text-xs font-extrabold text-slate-700">
            All hypervisor cluster nodes operational across US-East, EU-Central, and AP-South.
          </span>
        </div>
        <span className="font-mono text-xs text-slate-500 font-bold sm:pl-2 shrink-0">
          Uptime Index Latency: 24ms
        </span>
      </div>

      {/* Floating Export Action for Report Generation */}
      <button 
        onClick={handleExportCSV}
        className="fixed bottom-24 md:bottom-24 right-4 sm:right-6 w-12 h-12 sm:w-14 sm:h-14 bg-[#0058be] hover:bg-[#004eab] text-white rounded-full shadow-lg flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-40 group cursor-pointer"
        title="Export Report CSV of Demos"
      >
        <DownloadCloud className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2px]" />
        <span className="absolute right-full mr-4 bg-slate-900 border border-slate-800 text-slate-100 px-3 py-1 text-xs font-semibold rounded shadow-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none">
          Export Demo Manifest
        </span>
      </button>

    </div>
  );
}
