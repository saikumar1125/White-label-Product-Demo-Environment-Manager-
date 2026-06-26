import { db } from '../../_lib/db.js';
import { authenticateToken } from '../../_lib/auth.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  const user = await authenticateToken(req, res);
  if (!user) return;

  try {
    if (user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Access denied. Only administrators can clear logs.', code: 403 });
    }

    await db.clearLogs();
    await db.addLog({
      id: 'LOG_CLEAR',
      timestamp: new Date().toTimeString().split(' ')[0],
      type: 'info',
      client: 'SYSTEM',
      message: 'Auditing log index cleared by brandsparkx administrator.'
    });

    return res.status(200).json({ success: true, message: 'Logs cleared successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to clear logs: ' + error.message, code: 500 });
  }
}
