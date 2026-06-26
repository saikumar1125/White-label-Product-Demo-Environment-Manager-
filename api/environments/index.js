import { db } from '../../_lib/db.js';
import { authenticateToken } from '../../_lib/auth.js';

export default async function handler(req, res) {
  const user = await authenticateToken(req, res);
  if (!user) return;

  // GET /api/environments
  if (req.method === 'GET') {
    try {
      const environments = await db.getEnvironments();
      if (user.role === 'admin') {
        return res.status(200).json(environments);
      }

      const clientEnvs = environments.filter(d => d.clientName === user.clientName);
      if (clientEnvs.length === 0) {
        const defaultEnv = {
          clientName: user.clientName,
          productType: 'crm',
          productLabel: 'Enterprise SaaS',
          adminEmail: user.email,
          status: 'Active',
          expiresAt: 'Nov 24, 2026',
          lastActivity: 'Provisioned just now',
          healthScore: 98.4,
          loadState: 'Operational',
          avatarInitials: user.clientName.slice(0, 2).toUpperCase(),
          avatarBg: 'bg-blue-100',
          avatarText: 'text-blue-600'
        };
        const newEnv = await db.createEnvironment(defaultEnv);
        return res.status(200).json([newEnv]);
      }
      return res.status(200).json(clientEnvs);
    } catch (error) {
      return res.status(500).json({ success: false, message: 'Failed to fetch environments: ' + error.message, code: 500 });
    }
  }

  // POST /api/environments
  if (req.method === 'POST') {
    try {
      if (user.role !== 'admin') {
        return res.status(403).json({ success: false, message: 'Access denied. Only administrators can create environments.', code: 403 });
      }

      const {
        id, clientName, productType, productLabel, status, expiresAt,
        lastActivity, adminEmail, dataPreset, sessionRecording,
        analyticsTracking, healthScore, loadState, avatarInitials,
        avatarBg, avatarText
      } = req.body;

      if (!clientName || !productType || !adminEmail) {
        return res.status(400).json({ success: false, message: 'Required fields: clientName, productType, adminEmail are missing', code: 400 });
      }

      const newEnv = {
        id: id || 'DEMO_' + Math.random().toString(36).substr(2, 9).toUpperCase(),
        clientName,
        productType,
        productLabel: productLabel || 'SaaS Portal',
        status: status || 'Provisioning',
        expiresAt: expiresAt || 'Never Expires',
        lastActivity: lastActivity || 'Just Now',
        adminEmail,
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

      await db.addLog({
        id: 'LOG_' + Math.random().toString(36).substr(2, 9).toUpperCase(),
        timestamp: new Date().toTimeString().split(' ')[0],
        type: 'info',
        client: clientName,
        message: `Began deployment task. Allocating cluster resources, pulling product image ${productLabel}.`
      });

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

      return res.status(201).json(savedEnv);
    } catch (error) {
      return res.status(500).json({ success: false, message: 'Failed to create environment: ' + error.message, code: 500 });
    }
  }

  return res.status(405).json({ success: false, message: 'Method Not Allowed' });
}
