import { db } from '../../_lib/db.js';
import { authenticateToken } from '../../_lib/auth.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  const user = await authenticateToken(req, res);
  if (!user) return;

  try {
    const logs = await db.getLogs();
    if (user.role === 'admin') {
      return res.status(200).json(logs);
    }
    const clientLogs = logs.filter(l => l.client === user.clientName);
    return res.status(200).json(clientLogs);
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch logs: ' + error.message, code: 500 });
  }
}
