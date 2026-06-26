import { db } from './db.js';

/**
 * Shared authentication middleware for Vercel serverless functions.
 * Extracts and validates Bearer token from Authorization header,
 * then resolves user role and clientName from Supabase.
 *
 * Returns { user } on success, or sends a 401 JSON response.
 */
export async function authenticateToken(req, res) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ success: false, message: 'Access denied. Authorization token missing.', code: 401 });
    return null;
  }

  const token = authHeader.split(' ')[1];
  let email = null;
  let name = null;

  try {
    if (token.startsWith('mock-token-') || token.startsWith('google-token-')) {
      const base64Data = token.replace('mock-token-', '').replace('google-token-', '');
      const decoded = JSON.parse(Buffer.from(base64Data, 'base64').toString('utf-8'));
      email = decoded.email;
      name = decoded.name;
    } else {
      res.status(401).json({ success: false, message: 'Invalid authorization token format.', code: 401 });
      return null;
    }

    if (!email) {
      res.status(401).json({ success: false, message: 'Invalid token payload: Email missing.', code: 401 });
      return null;
    }

    let role = 'client';
    let clientName = null;

    if (email === 'admin@brandsparkx.com') {
      role = 'admin';
      name = name || 'BrandSparkX Admin';
    } else {
      const customers = await db.getCustomers();
      let customer = customers.find(c => c.admin_email === email);
      if (!customer) {
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

    return { email, name, role, clientName };
  } catch (error) {
    res.status(401).json({ success: false, message: 'Authorization expired or invalid: ' + error.message, code: 401 });
    return null;
  }
}
