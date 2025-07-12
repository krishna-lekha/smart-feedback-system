const express = require('express');
const router = express.Router();
const Admin = require('../models/Admin'); // path to your Admin model
const { sendWelcomeEmail } = require('../services/emailService');

// POST /admin/signup
router.post('/signup', async (req, res) => {
  const { email, username, password } = req.body;

  try {
    // Check if admin already exists
    const existing = await Admin.findOne({ email });
    if (existing) {
      return res.status(400).json({ error: 'Admin already exists' });
    }

    // Create new admin
    const newAdmin = new Admin({ email, username, password });
    await newAdmin.save();

    // Send Welcome Email
    await sendWelcomeEmail(email, username);

    res.status(201).json({ message: 'Admin signed up successfully' });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ error: 'Signup failed' });
  }
});

const getEmails = require("../fetchEmails"); // import your email sync logic

// Existing signup route...

// ADD: Gmail Feedback Sync Route
router.get('/sync-emails', async (req, res) => {
  try {
    await getEmails(); // call the Gmail fetch logic
    res.status(200).json({ message: 'Emails synced and saved as feedback.' });
  } catch (err) {
    console.error('Sync error:', err);
    res.status(500).json({ message: 'Failed to sync emails.' });
  }
});


module.exports = router;
