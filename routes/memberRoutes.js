const express = require('express');
const Member = require('../models/member.js');
const router = express.Router();

// Register a Member
router.post('/', async (req, res) => {
  try {
    const { username, contact, phoneNo, email, dailyExercise, dailyDiet } = req.body;

    // Check if all fields are provided
    if (!username || !contact || !phoneNo || !email || !dailyExercise || !dailyDiet) {
      return res.status(400).json({ 
        message: 'All fields are required. Please provide username, contact, phoneNo, email, dailyExercise, and dailyDiet.' 
      });
    }

    // Check if the member already exists
    const existingMember = await Member.findOne({ email });
    if (existingMember) {
      return res.status(400).json({ message: 'Member with this email already exists.' });
    }

    // Create a new member
    const newMember = new Member({
      username,
      contact,
      phoneNo,
      email,
      dailyExercise,
      dailyDiet,
    });

    // Save member to the database
    await newMember.save();
    res.status(201).json({ message: 'Member registered successfully', member: newMember });
  } catch (err) {
    console.error('Error registering member:', err);
    res.status(500).json({ message: 'Failed to register member', error: err.message });
  }
});

// Get All Members
router.get('/', async (req, res) => {
  try {
    const members = await Member.find().select('-__v');
    res.json(members);
  } catch (err) {
    console.error('Error fetching members:', err);
    res.status(500).json({ message: 'Failed to fetch members', error: err.message });
  }
});

module.exports = router;
