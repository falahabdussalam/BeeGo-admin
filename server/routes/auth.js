const express = require('express');
const router = express.Router();
const store = require('../data/store');

// Default admin credentials (can also be configured in settings or .env)
const DEFAULT_ADMIN = {
  email: process.env.ADMIN_EMAIL || 'admin@beego.com',
  password: process.env.ADMIN_PASSWORD || 'admin123',
  name: 'BeeGo Administrator',
  role: 'Store Superadmin'
};

// POST /api/auth/login - Admin Login
router.post('/login', (req, res) => {
  try {
    const { email, username, password } = req.body;
    const inputUser = (email || username || '').trim().toLowerCase();
    const inputPass = (password || '').trim();

    const settings = store.getSettings();
    const targetEmail = (settings.contactEmail || DEFAULT_ADMIN.email).toLowerCase();
    const adminPass = DEFAULT_ADMIN.password;

    // Allow admin@beego.com or "admin" as username with default password
    const isUserMatch = inputUser === targetEmail || inputUser === 'admin' || inputUser === 'admin@beego.com';
    const isPassMatch = inputPass === adminPass;

    if (!isUserMatch || !isPassMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid admin credentials. Please verify your email/username and password.'
      });
    }

    const token = 'beego-admin-token-' + Date.now();
    const userProfile = {
      name: DEFAULT_ADMIN.name,
      email: targetEmail,
      role: DEFAULT_ADMIN.role,
      token,
      loginAt: new Date().toISOString()
    };

    store.logActivity('Admin Login', `Admin user logged into command center`);

    res.json({
      success: true,
      message: 'Admin authenticated successfully',
      token,
      user: userProfile
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/auth/me - Check current admin session
router.get('/me', (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ success: false, message: 'No authorization header provided' });
    }

    const settings = store.getSettings();
    res.json({
      success: true,
      user: {
        name: DEFAULT_ADMIN.name,
        email: settings.contactEmail || DEFAULT_ADMIN.email,
        role: DEFAULT_ADMIN.role
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
