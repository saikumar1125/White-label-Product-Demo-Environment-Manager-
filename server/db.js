import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { supabase } from './supabase.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const LOCAL_DB_PATH = path.join(__dirname, 'data.json');

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

// Initial realistic data sets for seeding
const INITIAL_DEMOS = [
  {
    id: "DEMO-98231-GDC",
    client_name: "Global Dynamics Corp",
    product_type: "crm",
    product_label: "Enterprise SaaS",
    status: "Active",
    expires_at: "Oct 24, 2026",
    last_activity: "2 mins ago",
    admin_email: "admin@gdc.com",
    data_preset: "retail",
    session_recording: true,
    analytics_tracking: true,
    health_score: 98.4,
    load_state: "Operational",
    avatar_initials: "G",
    avatar_bg: "bg-blue-100",
    avatar_text: "text-blue-600"
  },
  {
    id: "DEMO-00452-VEL",
    client_name: "Velocity Fintech",
    product_type: "crm",
    product_label: "Trading Platform",
    status: "Provisioning",
    expires_at: "Awaiting Deployment",
    last_activity: "14 mins ago",
    admin_email: "systems@velocity.io",
    data_preset: "fintech",
    session_recording: false,
    analytics_tracking: true,
    health_score: 72.1,
    load_state: "In Progress",
    avatar_initials: "V",
    avatar_bg: "bg-orange-100",
    avatar_text: "text-orange-600"
  },
  {
    id: "DEMO-44129-ECO",
    client_name: "EcoStrata Solutions",
    product_type: "hrms",
    product_label: "LMS / Training",
    status: "Active",
    expires_at: "Expires in 2 days",
    last_activity: "1 hour ago",
    admin_email: "training@ecostrata.org",
    data_preset: "healthcare",
    session_recording: true,
    analytics_tracking: false,
    health_score: 94.8,
    load_state: "Operational",
    avatar_initials: "E",
    avatar_bg: "bg-green-100",
    avatar_text: "text-green-600"
  },
  {
    id: "DEMO-11200-SRE",
    client_name: "Summit Real Estate",
    product_type: "erp",
    product_label: "Asset Mgmt",
    status: "Expired",
    expires_at: "Expired Sep 12, 2025",
    last_activity: "3 days ago",
    admin_email: "admin@summitre.com",
    data_preset: "empty",
    session_recording: false,
    analytics_tracking: false,
    health_score: 0,
    load_state: "Awaiting",
    avatar_initials: "S",
    avatar_bg: "bg-purple-100",
    avatar_text: "text-purple-600"
  },
  {
    id: "DEMO-90210-APX",
    client_name: "Apex Global",
    product_type: "hrms",
    product_label: "Custom HRMS (v4.2)",
    status: "Active",
    expires_at: "Dec 15, 2026",
    last_activity: "2 mins ago",
    admin_email: "hr@apexglobal.com",
    data_preset: "healthcare",
    session_recording: true,
    analytics_tracking: true,
    health_score: 92.2,
    load_state: "Operational",
    avatar_initials: "A",
    avatar_bg: "bg-blue-100",
    avatar_text: "text-blue-600"
  },
  {
    id: "DEMO-11822-NXS",
    client_name: "Nexus Systems",
    product_type: "crm",
    product_label: "Sales CRM (Alpha)",
    status: "Active",
    expires_at: "Jan 10, 2027",
    last_activity: "1 hour ago",
    admin_email: "contact@nexussystems.io",
    data_preset: "retail",
    session_recording: true,
    analytics_tracking: true,
    health_score: 96.5,
    load_state: "Operational",
    avatar_initials: "N",
    avatar_bg: "bg-purple-150",
    avatar_text: "text-purple-600"
  }
];

const INITIAL_LOGS = [
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

const INITIAL_CUSTOMERS = [
  {
    id: "CUST-GDC",
    client_name: "Global Dynamics Corp",
    admin_email: "admin@gdc.com",
    status: "Active"
  },
  {
    id: "CUST-VEL",
    client_name: "Velocity Fintech",
    admin_email: "systems@velocity.io",
    status: "Active"
  },
  {
    id: "CUST-ECO",
    client_name: "EcoStrata Solutions",
    admin_email: "training@ecostrata.org",
    status: "Active"
  }
];

const INITIAL_USERS = [
  {
    id: "USER-ADMIN",
    email: "admin@brandsparkx.com",
    password: "Sparkx2026!", // In a production app, this would be salted & hashed using bcrypt
    name: "BrandSparkX Admin"
  }
];

// Helper to read local JSON database
function readLocalDB() {
  if (!fs.existsSync(LOCAL_DB_PATH)) {
    const defaultData = {
      environments: INITIAL_DEMOS,
      logs: INITIAL_LOGS,
      customers: INITIAL_CUSTOMERS,
      users: INITIAL_USERS
    };
    fs.writeFileSync(LOCAL_DB_PATH, JSON.stringify(defaultData, null, 2), 'utf-8');
    return defaultData;
  }
  try {
    const raw = fs.readFileSync(LOCAL_DB_PATH, 'utf-8');
    const parsed = JSON.parse(raw);
    if (!parsed.users) {
      parsed.users = INITIAL_USERS;
      fs.writeFileSync(LOCAL_DB_PATH, JSON.stringify(parsed, null, 2), 'utf-8');
    }
    return parsed;
  } catch (err) {
    console.error('Error reading data.json:', err);
    return { environments: [], logs: [], customers: [], users: INITIAL_USERS };
  }
}

// Helper to write local JSON database
function writeLocalDB(data) {
  try {
    fs.writeFileSync(LOCAL_DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing to data.json:', err);
  }
}

// Initialize Supabase Tables Seeding
async function seedSupabaseIfNeeded() {
  if (!supabase) return;
  try {
    // 1. Seed environments
    const { count: envCount, error: envError } = await supabase
      .from('whitelabel_product_demo_environment')
      .select('*', { count: 'exact', head: true });
    
    if (!envError && envCount === 0) {
      console.log('Seeding Supabase environments...');
      await supabase.from('whitelabel_product_demo_environment').insert(INITIAL_DEMOS);
    }

    // 2. Seed logs
    const { count: logCount, error: logError } = await supabase
      .from('audit_logs')
      .select('*', { count: 'exact', head: true });
    
    if (!logError && logCount === 0) {
      console.log('Seeding Supabase audit logs...');
      await supabase.from('audit_logs').insert(INITIAL_LOGS);
    }

    // 3. Seed customers
    const { count: custCount, error: custError } = await supabase
      .from('customers')
      .select('*', { count: 'exact', head: true });
    
    if (!custError && custCount === 0) {
      console.log('Seeding Supabase customers...');
      await supabase.from('customers').insert(INITIAL_CUSTOMERS);
    }

    // 4. Seed users
    const { count: userCount, error: userError } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true });
    
    if (!userError && userCount === 0) {
      console.log('Seeding Supabase default user...');
      await supabase.from('users').insert(INITIAL_USERS);
    }
  } catch (error) {
    console.warn('Supabase seeding skipped or failed (check table permissions/existence):', error.message);
  }
}

// Perform initial seeding
seedSupabaseIfNeeded();

export const db = {
  // --- Environments Operations ---
  async getEnvironments() {
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('whitelabel_product_demo_environment')
          .select('*')
          .order('created_at', { ascending: false });
        if (!error && data) return data.map(toCamelCase);
        console.error('Supabase getEnvironments error, falling back:', error.message);
      } catch (err) {
        console.error('Supabase getEnvironments exception, falling back:', err);
      }
    }
    return readLocalDB().environments.map(toCamelCase);
  },

  async getEnvironmentById(id) {
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('whitelabel_product_demo_environment')
          .select('*')
          .eq('id', id)
          .single();
        if (!error && data) return toCamelCase(data);
        console.error('Supabase getEnvironmentById error, falling back:', error?.message);
      } catch (err) {
        console.error('Supabase getEnvironmentById exception, falling back:', err);
      }
    }
    const local = readLocalDB();
    const found = local.environments.find(e => e.id === id);
    return found ? toCamelCase(found) : null;
  },

  async createEnvironment(env) {
    const dbEnv = toSnakeCase(env);
    dbEnv.created_at = new Date().toISOString();
    dbEnv.updated_at = new Date().toISOString();
    
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('whitelabel_product_demo_environment')
          .insert([dbEnv])
          .select();
        if (!error && data) return toCamelCase(data[0]);
        console.error('Supabase createEnvironment error, falling back:', error.message);
      } catch (err) {
        console.error('Supabase createEnvironment exception, falling back:', err);
      }
    }
    
    const local = readLocalDB();
    local.environments.unshift(dbEnv);
    writeLocalDB(local);
    return toCamelCase(dbEnv);
  },

  async updateEnvironment(id, fields) {
    const dbFields = toSnakeCase(fields);
    dbFields.updated_at = new Date().toISOString();
    
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('whitelabel_product_demo_environment')
          .update(dbFields)
          .eq('id', id)
          .select();
        if (!error && data) return toCamelCase(data[0]);
        console.error('Supabase updateEnvironment error, falling back:', error.message);
      } catch (err) {
        console.error('Supabase updateEnvironment exception, falling back:', err);
      }
    }

    const local = readLocalDB();
    const idx = local.environments.findIndex(e => e.id === id);
    if (idx !== -1) {
      local.environments[idx] = { ...local.environments[idx], ...dbFields };
      writeLocalDB(local);
      return toCamelCase(local.environments[idx]);
    }
    return null;
  },

  async deleteEnvironment(id) {
    if (supabase) {
      try {
        const { error } = await supabase
          .from('whitelabel_product_demo_environment')
          .delete()
          .eq('id', id);
        if (!error) return true;
        console.error('Supabase deleteEnvironment error, falling back:', error.message);
      } catch (err) {
        console.error('Supabase deleteEnvironment exception, falling back:', err);
      }
    }

    const local = readLocalDB();
    const filtered = local.environments.filter(e => e.id !== id);
    if (filtered.length !== local.environments.length) {
      local.environments = filtered;
      writeLocalDB(local);
      return true;
    }
    return false;
  },

  // --- Audit Logs Operations ---
  async getLogs() {
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('audit_logs')
          .select('*')
          .order('created_at', { ascending: false });
        if (!error && data) return data;
        console.error('Supabase getLogs error, falling back:', error.message);
      } catch (err) {
        console.error('Supabase getLogs exception, falling back:', err);
      }
    }
    return readLocalDB().logs;
  },

  async addLog(log) {
    const newLog = { 
      ...log, 
      created_at: new Date().toISOString() 
    };

    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('audit_logs')
          .insert([newLog])
          .select();
        if (!error && data) return data[0];
        console.error('Supabase addLog error, falling back:', error.message);
      } catch (err) {
        console.error('Supabase addLog exception, falling back:', err);
      }
    }

    const local = readLocalDB();
    local.logs.unshift(newLog);
    writeLocalDB(local);
    return newLog;
  },

  async clearLogs() {
    if (supabase) {
      try {
        const { error } = await supabase
          .from('audit_logs')
          .delete()
          .neq('id', 'SYSTEM_CLEAR_PROTECTION');
        if (!error) return true;
        console.error('Supabase clearLogs error, falling back:', error.message);
      } catch (err) {
        console.error('Supabase clearLogs exception, falling back:', err);
      }
    }

    const local = readLocalDB();
    local.logs = [];
    writeLocalDB(local);
    return true;
  },

  // --- Customers Operations ---
  async getCustomers() {
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('customers')
          .select('*')
          .order('created_at', { ascending: false });
        if (!error && data) return data;
        console.error('Supabase getCustomers error, falling back:', error.message);
      } catch (err) {
        console.error('Supabase getCustomers exception, falling back:', err);
      }
    }
    return readLocalDB().customers;
  },

  async createCustomer(customer) {
    const newCust = { 
      ...customer, 
      created_at: new Date().toISOString(), 
      updated_at: new Date().toISOString() 
    };

    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('customers')
          .insert([newCust])
          .select();
        if (!error && data) return data[0];
        console.error('Supabase createCustomer error, falling back:', error.message);
      } catch (err) {
        console.error('Supabase createCustomer exception, falling back:', err);
      }
    }

    const local = readLocalDB();
    local.customers.unshift(newCust);
    writeLocalDB(local);
    return newCust;
  },

  // --- User Operations ---
  async getUserByEmail(email) {
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('email', email)
          .single();
        if (!error && data) return data;
        console.error('Supabase getUserByEmail error, falling back:', error?.message);
      } catch (err) {
        console.error('Supabase getUserByEmail exception, falling back:', err);
      }
    }
    const local = readLocalDB();
    return local.users.find(u => u.email === email) || null;
  },

  async createUser(user) {
    const newUser = {
      ...user,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('users')
          .insert([newUser])
          .select();
        if (!error && data) return data[0];
        console.error('Supabase createUser error, falling back:', error.message);
      } catch (err) {
        console.error('Supabase createUser exception, falling back:', err);
      }
    }

    const local = readLocalDB();
    local.users.push(newUser);
    writeLocalDB(local);
    return newUser;
  }
};
