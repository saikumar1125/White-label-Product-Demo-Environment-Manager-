import { db } from '../_lib/db.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  try {
    const { credential } = req.body;
    if (!credential) {
      return res.status(400).json({ success: false, message: 'Google credential token is required', code: 400 });
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
      // Simulation fallback: credential may be an email string directly
      email = credential;
      name = credential.split('@')[0].charAt(0).toUpperCase() + credential.split('@')[0].slice(1);
    }

    if (!email) {
      return res.status(400).json({ success: false, message: 'Email not found in Google token', code: 400 });
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
    }

    const token = `google-token-${Buffer.from(JSON.stringify({ email, name })).toString('base64')}`;
    return res.status(200).json({
      success: true,
      token,
      user: { id: email, email, name, role, clientName }
    });
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Google auth verification failed: ' + error.message, code: 401 });
  }
}
