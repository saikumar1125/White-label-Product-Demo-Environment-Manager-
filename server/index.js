import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { db } from './db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// --- Helper for standard responses ---
const sendSuccess = (res, data, code = 200) => {
  res.status(code).json(data);
};

const sendError = (res, message, code = 500) => {
  res.status(code).json({ success: false, message, code });
};

// --- AUTHENTICATION MIDDLEWARE ---
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return sendError(res, 'Access denied. Authorization token missing.', 401);
    }

    const token = authHeader.split(' ')[1];
    let email = null;
    let name = null;

    if (token.startsWith('mock-token-') || token.startsWith('google-token-')) {
      const base64Data = token.replace('mock-token-', '').replace('google-token-', '');
      const decoded = JSON.parse(Buffer.from(base64Data, 'base64').toString('utf-8'));
      email = decoded.email;
      name = decoded.name;
    } else {
      return sendError(res, 'Invalid authorization token format.', 401);
    }

    if (!email) {
      return sendError(res, 'Invalid token payload: Email missing.', 401);
    }

    // Determine user role and company association
    let role = 'client';
    let clientName = null;

    if (email === 'admin@brandsparkx.com') {
      role = 'admin';
      name = name || 'BrandSparkX Admin';
    } else {
      const customers = await db.getCustomers();
      let customer = customers.find(c => c.admin_email === email);
      if (!customer) {
        // Dynamically create a customer record for easy client testing
        const domain = email.split('@')[0];
        clientName = domain.charAt(0).toUpperCase() + domain.slice(1) + ' Corp';
        customer = await db.createCustomer({
          id: 'CUST_' + Math.random().toString(36).substr(2, 9).toUpperCase(),
          client_name: clientName,
          admin_email: email,
          status: 'Active'
        });
      } else {
        clientName = customer.client_name;
      }
      name = name || (email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1));
    }

    req.user = { email, name, role, clientName };
    next();
  } catch (error) {
    sendError(res, 'Authorization expired or invalid: ' + error.message, 401);
  }
};

// --- AUTHENTICATION API ROUTES ---

// Login endpoint (Standard Email/Password)
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return sendError(res, 'Email and password are required', 400);
    }

    // Standard local fallback check
    if (email === 'admin@brandsparkx.com' && password === 'Sparkx2026!') {
      const token = `mock-token-${Buffer.from(JSON.stringify({ email, name: 'BrandSparkX Admin', id: 'USER-ADMIN' })).toString('base64')}`;
      return sendSuccess(res, {
        success: true,
        token,
        user: {
          id: 'USER-ADMIN',
          email,
          name: 'BrandSparkX Admin',
          role: 'admin'
        }
      });
    }

    // Check custom customers
    const customers = await db.getCustomers();
    const customer = customers.find(c => c.admin_email === email);
    
    // In a simulation, if they input a client email, let them log in with any password
    if (customer) {
      const token = `mock-token-${Buffer.from(JSON.stringify({ email, name: customer.client_name, id: customer.id })).toString('base64')}`;
      return sendSuccess(res, {
        success: true,
        token,
        user: {
          id: customer.id,
          email: email,
          name: customer.client_name,
          role: 'client',
          clientName: customer.client_name
        }
      });
    }

    // Standard user DB check
    const user = await db.getUserByEmail(email);
    if (!user) {
      return sendError(res, 'Account with this email does not exist.', 401);
    }

    if (user.password !== password) {
      return sendError(res, 'Incorrect password. Please try again.', 401);
    }

    const token = `mock-token-${Buffer.from(JSON.stringify({ email: user.email, id: user.id })).toString('base64')}`;

    sendSuccess(res, {
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.email === 'admin@brandsparkx.com' ? 'admin' : 'client'
      }
    });
  } catch (error) {
    sendError(res, 'Login service error: ' + error.message);
  }
});

// Google Authentication endpoint
app.post('/api/auth/google', async (req, res) => {
  try {
    const { credential } = req.body;
    if (!credential) {
      return sendError(res, 'Google credential token is required', 400);
    }

    let email = null;
    let name = null;

    // Decode JWT from Google credential ID Token
    const parts = credential.split('.');
    if (parts.length === 3) {
      const payloadBase64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
      const payload = JSON.parse(Buffer.from(payloadBase64, 'base64').toString('utf-8'));
      email = payload.email;
      name = payload.name;
    } else {
      // Custom testing/simulation fallback: credential may be email itself
      email = credential;
      name = credential.split('@')[0].charAt(0).toUpperCase() + credential.split('@')[0].slice(1);
    }

    if (!email) {
      return sendError(res, 'Email not found in Google token', 400);
    }

    // Check role and retrieve clientName
    let role = 'client';
    let clientName = null;

    if (email === 'admin@brandsparkx.com') {
      role = 'admin';
      name = name || 'BrandSparkX Admin';
    } else {
      const customers = await db.getCustomers();
      let customer = customers.find(c => c.admin_email === email);
      if (!customer) {
        // Create new client/customer dynamically
        const domain = email.split('@')[0];
        clientName = domain.charAt(0).toUpperCase() + domain.slice(1) + ' Corp';
        customer = await db.createCustomer({
          id: 'CUST_' + Math.random().toString(36).substr(2, 9).toUpperCase(),
          client_name: clientName,
          admin_email: email,
          status: 'Active'
        });
      } else {
        clientName = customer.client_name;
      }
    }

    const token = `google-token-${Buffer.from(JSON.stringify({ email, name })).toString('base64')}`;

    sendSuccess(res, {
      success: true,
      token,
      user: {
        id: email,
        email,
        name,
        role,
        clientName
      }
    });
  } catch (error) {
    sendError(res, 'Google auth verification failed: ' + error.message, 401);
  }
});

// Profile validation endpoint
app.get('/api/auth/me', authenticateToken, async (req, res) => {
  try {
    sendSuccess(res, req.user);
  } catch (error) {
    sendError(res, 'Profile fetch error: ' + error.message);
  }
});

// --- CORE TELEMETRY API ROUTES ---

// 1. Dashboard summary stats
app.get('/api/dashboard/summary', authenticateToken, async (req, res) => {
  try {
    const environments = await db.getEnvironments();
    
    if (req.user.role === 'admin') {
      const activeCount = environments.filter(d => d.status === 'Active').length;
      const provisioningCount = environments.filter(d => d.status === 'Provisioning').length;

      const totalDemosOffset = 1284 - 6;
      const activeDemosOffset = 842 - 4;
      const pendingDemosOffset = 23 - 1;

      sendSuccess(res, {
        totalDemos: totalDemosOffset + environments.length,
        activeDemos: activeDemosOffset + activeCount,
        pendingDemos: pendingDemosOffset + provisioningCount,
        environmentsCount: environments.length
      });
    } else {
      // Client role summary
      const clientEnvs = environments.filter(d => d.clientName === req.user.clientName);
      const activeCount = clientEnvs.filter(d => d.status === 'Active').length;
      const provisioningCount = clientEnvs.filter(d => d.status === 'Provisioning').length;

      sendSuccess(res, {
        totalDemos: clientEnvs.length,
        activeDemos: activeCount,
        pendingDemos: provisioningCount,
        environmentsCount: clientEnvs.length
      });
    }
  } catch (error) {
    sendError(res, 'Failed to fetch dashboard summary: ' + error.message);
  }
});

// 2. Fetch all environments
app.get('/api/environments', authenticateToken, async (req, res) => {
  try {
    const environments = await db.getEnvironments();
    if (req.user.role === 'admin') {
      sendSuccess(res, environments);
    } else {
      const clientEnvs = environments.filter(d => d.clientName === req.user.clientName);
      // Auto-provision a default sandbox for the client if they don't have one
      if (clientEnvs.length === 0) {
        const defaultEnv = {
          clientName: req.user.clientName,
          productType: 'crm',
          productLabel: 'Enterprise SaaS',
          adminEmail: req.user.email,
          status: 'Active',
          expiresAt: 'Nov 24, 2026',
          lastActivity: 'Provisioned just now',
          healthScore: 98.4,
          loadState: 'Operational',
          avatarInitials: req.user.clientName.slice(0, 2).toUpperCase(),
          avatarBg: 'bg-blue-100',
          avatarText: 'text-blue-600'
        };
        const newEnv = await db.createEnvironment(defaultEnv);
        sendSuccess(res, [newEnv]);
      } else {
        sendSuccess(res, clientEnvs);
      }
    }
  } catch (error) {
    sendError(res, 'Failed to fetch environments: ' + error.message);
  }
});

// 3. Fetch single environment
app.get('/api/environments/:id', authenticateToken, async (req, res) => {
  try {
    const env = await db.getEnvironmentById(req.params.id);
    if (!env) {
      return sendError(res, 'Environment not found', 404);
    }
    if (req.user.role !== 'admin' && env.clientName !== req.user.clientName) {
      return sendError(res, 'Access denied. You do not have permissions for this environment.', 403);
    }
    sendSuccess(res, env);
  } catch (error) {
    sendError(res, 'Failed to fetch environment details: ' + error.message);
  }
});

// 4. Create new environment
app.post('/api/environments', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return sendError(res, 'Access denied. Only administrators can create environments.', 403);
    }

    const { 
      id, clientName, productType, productLabel, status, expiresAt, 
      lastActivity, adminEmail, dataPreset, sessionRecording, 
      analyticsTracking, healthScore, loadState, avatarInitials, 
      avatarBg, avatarText 
    } = req.body;

    if (!clientName || !productType || !adminEmail) {
      return sendError(res, 'Required fields: clientName, productType, adminEmail are missing', 400);
    }

    const newEnv = {
      id: id || 'DEMO_' + Math.random().toString(36).substr(2, 9).toUpperCase(),
      clientName: clientName,
      productType: productType,
      productLabel: productLabel || 'SaaS Portal',
      status: status || 'Provisioning',
      expiresAt: expiresAt || 'Never Expires',
      lastActivity: lastActivity || 'Just Now',
      adminEmail: adminEmail,
      dataPreset: dataPreset || 'empty',
      sessionRecording: !!sessionRecording,
      analyticsTracking: analyticsTracking !== false,
      healthScore: healthScore !== undefined ? healthScore : 100,
      loadState: loadState || 'In Progress',
      avatarInitials: avatarInitials || clientName.slice(0, 2).toUpperCase(),
      avatarBg: avatarBg || 'bg-blue-100',
      avatarText: avatarText || 'text-blue-600'
    };

    const savedEnv = await db.createEnvironment(newEnv);

    // Append log event
    const creationLog = {
      id: 'LOG_' + Math.random().toString(36).substr(2, 9).toUpperCase(),
      timestamp: new Date().toTimeString().split(' ')[0],
      type: 'info',
      client: clientName,
      message: `Began deployment task. Allocating cluster resources, pulling product image ${productLabel}.`
    };
    await db.addLog(creationLog);

    // Add to customers if not present
    const customers = await db.getCustomers();
    const customerExists = customers.some(c => c.client_name === clientName);
    if (!customerExists) {
      await db.createCustomer({
        id: 'CUST_' + Math.random().toString(36).substr(2, 9).toUpperCase(),
        client_name: clientName,
        admin_email: adminEmail,
        status: 'Active'
      });
    }

    sendSuccess(res, savedEnv, 201);
  } catch (error) {
    sendError(res, 'Failed to create environment: ' + error.message);
  }
});

// 5. Update environment
app.patch('/api/environments/:id', authenticateToken, async (req, res) => {
  try {
    const env = await db.getEnvironmentById(req.params.id);
    if (!env) {
      return sendError(res, 'Environment not found to update', 404);
    }
    if (req.user.role !== 'admin' && env.clientName !== req.user.clientName) {
      return sendError(res, 'Access denied. You do not have permissions to update this environment.', 403);
    }

    const updated = await db.updateEnvironment(req.params.id, req.body);

    // Optional: Log update actions like extension or reactivation
    if (req.body.lastActivity && req.body.lastActivity.includes('Extended')) {
      const log = {
        id: 'LOG_' + Math.random().toString(36).substr(2, 9).toUpperCase(),
        timestamp: new Date().toTimeString().split(' ')[0],
        type: 'info',
        client: updated.clientName,
        message: `License extended successfully. New expiry: ${updated.expiresAt || 'Never'}.`
      };
      await db.addLog(log);
    } else if (req.body.status === 'Active' && req.body.lastActivity && req.body.lastActivity.includes('Reactivated')) {
      const log = {
        id: 'LOG_' + Math.random().toString(36).substr(2, 9).toUpperCase(),
        timestamp: new Date().toTimeString().split(' ')[0],
        type: 'success',
        client: updated.clientName,
        message: `Cluster container reactivated by Administrator. Health state: 100%.`
      };
      await db.addLog(log);
    }

    sendSuccess(res, updated);
  } catch (error) {
    sendError(res, 'Failed to update environment: ' + error.message);
  }
});

// 6. Delete/Terminate environment
app.delete('/api/environments/:id', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return sendError(res, 'Access denied. Only administrators can terminate environments.', 403);
    }

    const env = await db.getEnvironmentById(req.params.id);
    if (!env) {
      return sendError(res, 'Environment not found to delete', 404);
    }

    const deleted = await db.deleteEnvironment(req.params.id);
    if (deleted) {
      // Append log event
      const terminationLog = {
        id: 'LOG_' + Math.random().toString(36).substr(2, 9).toUpperCase(),
        timestamp: new Date().toTimeString().split(' ')[0],
        type: 'warn',
        client: env.clientName,
        message: `Manually terminated by Expert Partner. Reclaimed memory blocks and virtual storage nodes.`
      };
      await db.addLog(terminationLog);
      
      sendSuccess(res, { success: true, message: 'Environment terminated successfully' });
    } else {
      sendError(res, 'Failed to delete environment');
    }
  } catch (error) {
    sendError(res, 'Failed to terminate environment: ' + error.message);
  }
});

// 7. Get logs
app.get('/api/logs', authenticateToken, async (req, res) => {
  try {
    const logs = await db.getLogs();
    if (req.user.role === 'admin') {
      sendSuccess(res, logs);
    } else {
      const clientLogs = logs.filter(l => l.client === req.user.clientName);
      sendSuccess(res, clientLogs);
    }
  } catch (error) {
    sendError(res, 'Failed to fetch logs: ' + error.message);
  }
});

// 8. Clear logs
app.post('/api/logs/clear', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return sendError(res, 'Access denied. Only administrators can clear logs.', 403);
    }

    await db.clearLogs();
    const clearLog = {
      id: 'LOG_CLEAR',
      timestamp: new Date().toTimeString().split(' ')[0],
      type: 'info',
      client: 'SYSTEM',
      message: 'Auditing log index cleared by brandsparkx administrator.'
    };
    await db.addLog(clearLog);
    sendSuccess(res, { success: true, message: 'Logs cleared successfully' });
  } catch (error) {
    sendError(res, 'Failed to clear logs: ' + error.message);
  }
});

// 9. Get customers
app.get('/api/customers', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return sendError(res, 'Access denied. Only administrators can view customer profiles.', 403);
    }
    const customers = await db.getCustomers();
    sendSuccess(res, customers);
  } catch (error) {
    sendError(res, 'Failed to fetch customers: ' + error.message);
  }
});

// 10. Create customer
app.post('/api/customers', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return sendError(res, 'Access denied. Only administrators can create customer profiles.', 403);
    }

    const { clientName, adminEmail, status } = req.body;
    if (!clientName || !adminEmail) {
      return sendError(res, 'clientName and adminEmail are required', 400);
    }
    const newCust = {
      id: 'CUST_' + Math.random().toString(36).substr(2, 9).toUpperCase(),
      client_name: clientName,
      admin_email: adminEmail,
      status: status || 'Active'
    };
    const savedCust = await db.createCustomer(newCust);
    sendSuccess(res, savedCust, 201);
  } catch (error) {
    sendError(res, 'Failed to create customer: ' + error.message);
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', project: 'white-label-product-demo-envir' });
});

// --- AUTONOMIC PROVISIONING SIMULATOR RUNNER ---
setInterval(async () => {
  try {
    const environments = await db.getEnvironments();
    const provisioningDemos = environments.filter(d => d.status === 'Provisioning');

    for (const demo of provisioningDemos) {
      console.log(`Simulator: Found provisioning demo for ${demo.clientName}. Activating...`);
      
      await db.updateEnvironment(demo.id, {
        status: 'Active',
        expiresAt: 'Nov 24, 2026',
        lastActivity: 'Provisioned just now',
        healthScore: 98.4,
        loadState: 'Operational'
      });

      const newLog = {
        id: 'LOG_' + Math.random().toString(36).substr(2, 9).toUpperCase(),
        timestamp: new Date().toTimeString().split(' ')[0],
        type: 'success',
        client: demo.clientName,
        message: `Instance container initialized. IP allocated, data preset successfully injected.`
      };
      await db.addLog(newLog);
    }
  } catch (err) {
    console.error('Simulator error:', err.message);
  }
}, 8000);

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Backend Express server listening on http://0.0.0.0:${PORT}`);
});
