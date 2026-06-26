import { db } from '../_lib/db.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required', code: 400 });
    }

    // Admin hardcoded check
    if (email === 'admin@brandsparkx.com' && password === 'Sparkx2026!') {
      const token = `mock-token-${Buffer.from(JSON.stringify({ email, name: 'BrandSparkX Admin', id: 'USER-ADMIN' })).toString('base64')}`;
      return res.status(200).json({
        success: true,
        token,
        user: { id: 'USER-ADMIN', email, name: 'BrandSparkX Admin', role: 'admin' }
      });
    }

    // Check custom customers (any password accepted for client accounts)
    const customers = await db.getCustomers();
    const customer = customers.find(c => c.admin_email === email);
    if (customer) {
      const token = `mock-token-${Buffer.from(JSON.stringify({ email, name: customer.client_name, id: customer.id })).toString('base64')}`;
      return res.status(200).json({
        success: true,
        token,
        user: { id: customer.id, email, name: customer.client_name, role: 'client', clientName: customer.client_name }
      });
    }

    // Standard user DB check
    const user = await db.getUserByEmail(email);
    if (!user) {
      return res.status(401).json({ success: false, message: 'Account with this email does not exist.', code: 401 });
    }
    if (user.password !== password) {
      return res.status(401).json({ success: false, message: 'Incorrect password. Please try again.', code: 401 });
    }

    const token = `mock-token-${Buffer.from(JSON.stringify({ email: user.email, id: user.id })).toString('base64')}`;
    return res.status(200).json({
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
    return res.status(500).json({ success: false, message: 'Login service error: ' + error.message, code: 500 });
  }
}
