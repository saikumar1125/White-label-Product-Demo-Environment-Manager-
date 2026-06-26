import { supabase } from './supabase.js';

// --- Key Mapping Helpers ---
function toSnakeCase(obj) {
  if (!obj) return null;
  const mapped = {};
  for (const key in obj) {
    let snakeKey = key;
    if (key === 'clientName') snakeKey = 'client_name';
    else if (key === 'productType') snakeKey = 'product_type';
    else if (key === 'productLabel') snakeKey = 'product_label';
    else if (key === 'expiresAt') snakeKey = 'expires_at';
    else if (key === 'lastActivity') snakeKey = 'last_activity';
    else if (key === 'adminEmail') snakeKey = 'admin_email';
    else if (key === 'dataPreset') snakeKey = 'data_preset';
    else if (key === 'sessionRecording') snakeKey = 'session_recording';
    else if (key === 'analyticsTracking') snakeKey = 'analytics_tracking';
    else if (key === 'healthScore') snakeKey = 'health_score';
    else if (key === 'loadState') snakeKey = 'load_state';
    else if (key === 'avatarInitials') snakeKey = 'avatar_initials';
    else if (key === 'avatarBg') snakeKey = 'avatar_bg';
    else if (key === 'avatarText') snakeKey = 'avatar_text';
    mapped[snakeKey] = obj[key];
  }
  return mapped;
}

function toCamelCase(obj) {
  if (!obj) return null;
  return {
    id: obj.id,
    clientName: obj.client_name,
    productType: obj.product_type,
    productLabel: obj.product_label,
    status: obj.status,
    expiresAt: obj.expires_at,
    lastActivity: obj.last_activity,
    adminEmail: obj.admin_email,
    dataPreset: obj.data_preset,
    sessionRecording: !!obj.session_recording,
    analyticsTracking: !!obj.analytics_tracking,
    healthScore: Number(obj.health_score),
    loadState: obj.load_state,
    avatarInitials: obj.avatar_initials,
    avatarBg: obj.avatar_bg,
    avatarText: obj.avatar_text,
    created_at: obj.created_at,
    updated_at: obj.updated_at
  };
}

// --- Seed data (used when Supabase tables are empty) ---
const INITIAL_DEMOS = [
  {
    id: 'DEMO-98231-GDC', client_name: 'Global Dynamics Corp', product_type: 'crm',
    product_label: 'Enterprise SaaS', status: 'Active', expires_at: 'Oct 24, 2026',
    last_activity: '2 mins ago', admin_email: 'admin@gdc.com', data_preset: 'retail',
    session_recording: true, analytics_tracking: true, health_score: 98.4,
    load_state: 'Operational', avatar_initials: 'G', avatar_bg: 'bg-blue-100', avatar_text: 'text-blue-600'
  },
  {
    id: 'DEMO-00452-VEL', client_name: 'Velocity Fintech', product_type: 'crm',
    product_label: 'Trading Platform', status: 'Provisioning', expires_at: 'Awaiting Deployment',
    last_activity: '14 mins ago', admin_email: 'systems@velocity.io', data_preset: 'fintech',
    session_recording: false, analytics_tracking: true, health_score: 72.1,
    load_state: 'In Progress', avatar_initials: 'V', avatar_bg: 'bg-orange-100', avatar_text: 'text-orange-600'
  },
  {
    id: 'DEMO-44129-ECO', client_name: 'EcoStrata Solutions', product_type: 'hrms',
    product_label: 'LMS / Training', status: 'Active', expires_at: 'Expires in 2 days',
    last_activity: '1 hour ago', admin_email: 'training@ecostrata.org', data_preset: 'healthcare',
    session_recording: true, analytics_tracking: false, health_score: 94.8,
    load_state: 'Operational', avatar_initials: 'E', avatar_bg: 'bg-green-100', avatar_text: 'text-green-600'
  },
  {
    id: 'DEMO-11200-SRE', client_name: 'Summit Real Estate', product_type: 'erp',
    product_label: 'Asset Mgmt', status: 'Expired', expires_at: 'Expired Sep 12, 2025',
    last_activity: '3 days ago', admin_email: 'admin@summitre.com', data_preset: 'empty',
    session_recording: false, analytics_tracking: false, health_score: 0,
    load_state: 'Awaiting', avatar_initials: 'S', avatar_bg: 'bg-purple-100', avatar_text: 'text-purple-600'
  },
  {
    id: 'DEMO-90210-APX', client_name: 'Apex Global', product_type: 'hrms',
    product_label: 'Custom HRMS (v4.2)', status: 'Active', expires_at: 'Dec 15, 2026',
    last_activity: '2 mins ago', admin_email: 'hr@apexglobal.com', data_preset: 'healthcare',
    session_recording: true, analytics_tracking: true, health_score: 92.2,
    load_state: 'Operational', avatar_initials: 'A', avatar_bg: 'bg-blue-100', avatar_text: 'text-blue-600'
  },
  {
    id: 'DEMO-11822-NXS', client_name: 'Nexus Systems', product_type: 'crm',
    product_label: 'Sales CRM (Alpha)', status: 'Active', expires_at: 'Jan 10, 2027',
    last_activity: '1 hour ago', admin_email: 'contact@nexussystems.io', data_preset: 'retail',
    session_recording: true, analytics_tracking: true, health_score: 96.5,
    load_state: 'Operational', avatar_initials: 'N', avatar_bg: 'bg-purple-150', avatar_text: 'text-purple-600'
  }
];

const INITIAL_LOGS = [
  { id: 'L1', timestamp: '10:48:15', type: 'success', client: 'Global Dynamics Corp', message: "CRM instance fully provisioned. DB query times verified (SLA 15ms)." },
  { id: 'L2', timestamp: '10:45:02', type: 'info', client: 'Velocity Fintech', message: "Initiated DB seeding process using preset: 'Fintech Compliance'." },
  { id: 'L3', timestamp: '10:40:50', type: 'warn', client: 'EcoStrata Solutions', message: "CPU utilization spike warning (78% load on cluster Node-B)." },
  { id: 'L4', timestamp: '10:30:12', type: 'error', client: 'Summit Real Estate', message: "Auto-expiry reached. DNS propagation removed, container stopped safely." },
  { id: 'L5', timestamp: '10:15:33', type: 'success', client: 'Apex Global', message: "Syncing analytics event payload to GA4 container successfully." }
];

const INITIAL_CUSTOMERS = [
  { id: 'CUST-GDC', client_name: 'Global Dynamics Corp', admin_email: 'admin@gdc.com', status: 'Active' },
  { id: 'CUST-VEL', client_name: 'Velocity Fintech', admin_email: 'systems@velocity.io', status: 'Active' },
  { id: 'CUST-ECO', client_name: 'EcoStrata Solutions', admin_email: 'training@ecostrata.org', status: 'Active' }
];

const INITIAL_USERS = [
  { id: 'USER-ADMIN', email: 'admin@brandsparkx.com', password: 'Sparkx2026!', name: 'BrandSparkX Admin' }
];

// --- Supabase seeding (runs once on cold start if tables are empty) ---
async function seedSupabaseIfNeeded() {
  if (!supabase) return;
  try {
    const { count: envCount } = await supabase.from('whitelabel_product_demo_environment').select('*', { count: 'exact', head: true });
    if (envCount === 0) await supabase.from('whitelabel_product_demo_environment').insert(INITIAL_DEMOS);

    const { count: logCount } = await supabase.from('audit_logs').select('*', { count: 'exact', head: true });
    if (logCount === 0) await supabase.from('audit_logs').insert(INITIAL_LOGS);

    const { count: custCount } = await supabase.from('customers').select('*', { count: 'exact', head: true });
    if (custCount === 0) await supabase.from('customers').insert(INITIAL_CUSTOMERS);

    const { count: userCount } = await supabase.from('users').select('*', { count: 'exact', head: true });
    if (userCount === 0) await supabase.from('users').insert(INITIAL_USERS);
  } catch (error) {
    console.warn('Supabase seeding skipped:', error.message);
  }
}

seedSupabaseIfNeeded();

// --- DB Operations (Supabase-only; no local file fallback on Vercel) ---
export const db = {
  async getEnvironments() {
    const { data, error } = await supabase
      .from('whitelabel_product_demo_environment')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw new Error(error.message);
    return data.map(toCamelCase);
  },

  async getEnvironmentById(id) {
    const { data, error } = await supabase
      .from('whitelabel_product_demo_environment')
      .select('*')
      .eq('id', id)
      .single();
    if (error) return null;
    return toCamelCase(data);
  },

  async createEnvironment(env) {
    const dbEnv = toSnakeCase(env);
    dbEnv.created_at = new Date().toISOString();
    dbEnv.updated_at = new Date().toISOString();
    const { data, error } = await supabase
      .from('whitelabel_product_demo_environment')
      .insert([dbEnv])
      .select();
    if (error) throw new Error(error.message);
    return toCamelCase(data[0]);
  },

  async updateEnvironment(id, fields) {
    const dbFields = toSnakeCase(fields);
    dbFields.updated_at = new Date().toISOString();
    const { data, error } = await supabase
      .from('whitelabel_product_demo_environment')
      .update(dbFields)
      .eq('id', id)
      .select();
    if (error) throw new Error(error.message);
    return toCamelCase(data[0]);
  },

  async deleteEnvironment(id) {
    const { error } = await supabase
      .from('whitelabel_product_demo_environment')
      .delete()
      .eq('id', id);
    if (error) throw new Error(error.message);
    return true;
  },

  async getLogs() {
    const { data, error } = await supabase
      .from('audit_logs')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw new Error(error.message);
    return data;
  },

  async addLog(log) {
    const newLog = { ...log, created_at: new Date().toISOString() };
    const { data, error } = await supabase.from('audit_logs').insert([newLog]).select();
    if (error) throw new Error(error.message);
    return data[0];
  },

  async clearLogs() {
    const { error } = await supabase.from('audit_logs').delete().neq('id', 'SYSTEM_CLEAR_PROTECTION');
    if (error) throw new Error(error.message);
    return true;
  },

  async getCustomers() {
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw new Error(error.message);
    return data;
  },

  async createCustomer(customer) {
    const newCust = { ...customer, created_at: new Date().toISOString(), updated_at: new Date().toISOString() };
    const { data, error } = await supabase.from('customers').insert([newCust]).select();
    if (error) throw new Error(error.message);
    return data[0];
  },

  async getUserByEmail(email) {
    const { data, error } = await supabase.from('users').select('*').eq('email', email).single();
    if (error) return null;
    return data;
  }
};
