import { db } from '../../_lib/db.js';
import { authenticateToken } from '../../_lib/auth.js';

export default async function handler(req, res) {
  const user = await authenticateToken(req, res);
  if (!user) return;

  const { id } = req.query;

  // GET /api/environments/:id
  if (req.method === 'GET') {
    try {
      const env = await db.getEnvironmentById(id);
      if (!env) {
        return res.status(404).json({ success: false, message: 'Environment not found', code: 404 });
      }
      if (user.role !== 'admin' && env.clientName !== user.clientName) {
        return res.status(403).json({ success: false, message: 'Access denied. You do not have permissions for this environment.', code: 403 });
      }
      return res.status(200).json(env);
    } catch (error) {
      return res.status(500).json({ success: false, message: 'Failed to fetch environment details: ' + error.message, code: 500 });
    }
  }

  // PATCH /api/environments/:id
  if (req.method === 'PATCH') {
    try {
      const env = await db.getEnvironmentById(id);
      if (!env) {
        return res.status(404).json({ success: false, message: 'Environment not found to update', code: 404 });
      }
      if (user.role !== 'admin' && env.clientName !== user.clientName) {
        return res.status(403).json({ success: false, message: 'Access denied. You do not have permissions to update this environment.', code: 403 });
      }

      const updated = await db.updateEnvironment(id, req.body);

      if (req.body.lastActivity && req.body.lastActivity.includes('Extended')) {
        await db.addLog({
          id: 'LOG_' + Math.random().toString(36).substr(2, 9).toUpperCase(),
          timestamp: new Date().toTimeString().split(' ')[0],
          type: 'info',
          client: updated.clientName,
          message: `License extended successfully. New expiry: ${updated.expiresAt || 'Never'}.`
        });
      } else if (req.body.status === 'Active' && req.body.lastActivity && req.body.lastActivity.includes('Reactivated')) {
        await db.addLog({
          id: 'LOG_' + Math.random().toString(36).substr(2, 9).toUpperCase(),
          timestamp: new Date().toTimeString().split(' ')[0],
          type: 'success',
          client: updated.clientName,
          message: `Cluster container reactivated by Administrator. Health state: 100%.`
        });
      }

      return res.status(200).json(updated);
    } catch (error) {
      return res.status(500).json({ success: false, message: 'Failed to update environment: ' + error.message, code: 500 });
    }
  }

  // DELETE /api/environments/:id
  if (req.method === 'DELETE') {
    try {
      if (user.role !== 'admin') {
        return res.status(403).json({ success: false, message: 'Access denied. Only administrators can terminate environments.', code: 403 });
      }

      const env = await db.getEnvironmentById(id);
      if (!env) {
        return res.status(404).json({ success: false, message: 'Environment not found to delete', code: 404 });
      }

      await db.deleteEnvironment(id);
      await db.addLog({
        id: 'LOG_' + Math.random().toString(36).substr(2, 9).toUpperCase(),
        timestamp: new Date().toTimeString().split(' ')[0],
        type: 'warn',
        client: env.clientName,
        message: `Manually terminated by Expert Partner. Reclaimed memory blocks and virtual storage nodes.`
      });

      return res.status(200).json({ success: true, message: 'Environment terminated successfully' });
    } catch (error) {
      return res.status(500).json({ success: false, message: 'Failed to terminate environment: ' + error.message, code: 500 });
    }
  }

  return res.status(405).json({ success: false, message: 'Method Not Allowed' });
}
