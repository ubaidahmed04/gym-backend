const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/users.js')
const bcrypt = require('bcryptjs');  // Use bcryptjs
const router = express.Router();


router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Check if the user exists
    const user = await User.findOne({ username });
    if (!user) {
      console.log("User not found:", username);  // Debugging log
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Compare password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log("Password match result:", isPasswordValid);  // Debugging log


    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '24h' });
    res.json({ token, userId: user._id, userName: user.username, message: "Login Successfull" });

  } catch (err) {
    console.error('Server error:', err);  // Debugging log
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});











router.post('/register', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    console.log("Hashed password (during registration):", hashedPassword);  // Debugging log

    // Create a new user
    const newUser = new User({
      username,
      password: hashedPassword,
    });

    await newUser.save();
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error('Server error during registration:', error.message);  // Debugging log
    res.status(500).json({ message: 'Server error' });
  }
});





module.exports = router;