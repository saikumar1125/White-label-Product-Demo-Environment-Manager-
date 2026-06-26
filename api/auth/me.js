import { authenticateToken } from '../_lib/auth.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  try {
    const user = await authenticateToken(req, res);
    if (!user) return; // authenticateToken already sent the 401 response
    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Profile fetch error: ' + error.message, code: 500 });
  }
}
