export const INITIAL_DEMOS = [
  {
    id: "DEMO-98231-GDC",
    clientName: "Global Dynamics Corp",
    productType: "crm",
    productLabel: "Enterprise SaaS",
    status: "Active",
    expiresAt: "Oct 24, 2026",
    lastActivity: "2 mins ago",
    adminEmail: "admin@gdc.com",
    dataPreset: "retail",
    sessionRecording: true,
    analyticsTracking: true,
    healthScore: 98.4,
    loadState: "Operational",
    avatarInitials: "G",
    avatarBg: "bg-blue-100",
    avatarText: "text-blue-600"
  },
  {
    id: "DEMO-00452-VEL",
    clientName: "Velocity Fintech",
    productType: "crm",
    productLabel: "Trading Platform",
    status: "Provisioning",
    expiresAt: "Awaiting Deployment",
    lastActivity: "14 mins ago",
    adminEmail: "systems@velocity.io",
    dataPreset: "fintech",
    sessionRecording: false,
    analyticsTracking: true,
    healthScore: 72.1,
    loadState: "In Progress",
    avatarInitials: "V",
    avatarBg: "bg-orange-100",
    avatarText: "text-orange-600"
  },
  {
    id: "DEMO-44129-ECO",
    clientName: "EcoStrata Solutions",
    productType: "hrms",
    productLabel: "LMS / Training",
    status: "Active",
    expiresAt: "Expires in 2 days",
    lastActivity: "1 hour ago",
    adminEmail: "training@ecostrata.org",
    dataPreset: "healthcare",
    sessionRecording: true,
    analyticsTracking: false,
    healthScore: 94.8,
    loadState: "Operational",
    avatarInitials: "E",
    avatarBg: "bg-green-100",
    avatarText: "text-green-600"
  },
  {
    id: "DEMO-11200-SRE",
    clientName: "Summit Real Estate",
    productType: "erp",
    productLabel: "Asset Mgmt",
    status: "Expired",
    expiresAt: "Expired Sep 12, 2025",
    lastActivity: "3 days ago",
    adminEmail: "admin@summitre.com",
    dataPreset: "empty",
    sessionRecording: false,
    analyticsTracking: false,
    healthScore: 0,
    loadState: "Awaiting",
    avatarInitials: "S",
    avatarBg: "bg-purple-100",
    avatarText: "text-purple-600"
  },
  {
    id: "DEMO-90210-APX",
    clientName: "Apex Global",
    productType: "hrms",
    productLabel: "Custom HRMS (v4.2)",
    status: "Active",
    expiresAt: "Dec 15, 2026",
    lastActivity: "2 mins ago",
    adminEmail: "hr@apexglobal.com",
    dataPreset: "healthcare",
    sessionRecording: true,
    analyticsTracking: true,
    healthScore: 92.2,
    loadState: "Operational",
    avatarInitials: "A",
    avatarBg: "bg-blue-100",
    avatarText: "text-blue-600"
  },
  {
    id: "DEMO-11822-NXS",
    clientName: "Nexus Systems",
    productType: "crm",
    productLabel: "Sales CRM (Alpha)",
    status: "Active",
    expiresAt: "Jan 10, 2027",
    lastActivity: "1 hour ago",
    adminEmail: "contact@nexussystems.io",
    dataPreset: "retail",
    sessionRecording: true,
    analyticsTracking: true,
    healthScore: 96.5,
    loadState: "Operational",
    avatarInitials: "N",
    avatarBg: "bg-purple-150",
    avatarText: "text-purple-600"
  }
];

export const INITIAL_LOGS = [
  {
    id: "L1",
    timestamp: "10:48:15",
    type: "success",
    client: "Global Dynamics Corp",
    message: "CRM instance fully provisioned. DB query times verified (SLA 15ms)."
  },
  {
    id: "L2",
    timestamp: "10:45:02",
    type: "info",
    client: "Velocity Fintech",
    message: "Initiated DB seeding process using preset: 'Fintech Compliance'."
  },
  {
    id: "L3",
    timestamp: "10:40:50",
    type: "warn",
    client: "EcoStrata Solutions",
    message: "CPU utilization spike warning (78% load on cluster Node-B)."
  },
  {
    id: "L4",
    timestamp: "10:30:12",
    type: "error",
    client: "Summit Real Estate",
    message: "Auto-expiry reached. DNS propagation removed, container stopped safely."
  },
  {
    id: "L5",
    timestamp: "10:15:33",
    type: "success",
    client: "Apex Global",
    message: "Syncing analytics event payload to GA4 container successfully."
  }
];
