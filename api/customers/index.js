import { db } from '../../_lib/db.js';
import { authenticateToken } from '../../_lib/auth.js';

export default async function handler(req, res) {
  const user = await authenticateToken(req, res);
  if (!user) return;

  // GET /api/customers
  if (req.method === 'GET') {
    try {
      if (user.role !== 'admin') {
        return res.status(403).json({ success: false, message: 'Access denied. Only administrators can view customer profiles.', code: 403 });
      }
      const customers = await db.getCustomers();
      return res.status(200).json(customers);
    } catch (error) {
      return res.status(500).json({ success: false, message: 'Failed to fetch customers: ' + error.message, code: 500 });
    }
  }

  // POST /api/customers
  if (req.method === 'POST') {
    try {
      if (user.role !== 'admin') {
        return res.status(403).json({ success: false, message: 'Access denied. Only administrators can create customer profiles.', code: 403 });
      }

      const { clientName, adminEmail, status } = req.body;
      if (!clientName || !adminEmail) {
        return res.status(400).json({ success: false, message: 'clientName and adminEmail are required', code: 400 });
      }

      const newCust = {
        id: 'CUST_' + Math.random().toString(36).substr(2, 9).toUpperCase(),
        client_name: clientName,
        admin_email: adminEmail,
        status: status || 'Active'
      };
      const savedCust = await db.createCustomer(newCust);
      return res.status(201).json(savedCust);
    } catch (error) {
      return res.status(500).json({ success: false, message: 'Failed to create customer: ' + error.message, code: 500 });
    }
  }

  return res.status(405).json({ success: false, message: 'Method Not Allowed' });
}
