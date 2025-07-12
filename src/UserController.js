// userController.js
const User = require('../models/User'); // Your User model
const bcrypt = require('bcrypt');
const { sendWelcomeEmail } = require('../services/emailService');

exports.registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Create new user
    const newUser = new User({
      username,
      email,
      password: hashedPassword
    });
    
    // Save user to database
    const savedUser = await newUser.save();
    
    // Send welcome email
    await sendWelcomeEmail(email, username);
    
    res.status(201).json({
      message: 'User registered successfully',
      userId: savedUser._id
    });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};