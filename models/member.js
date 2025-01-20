const mongoose = require('mongoose');

// Define Member Schema
const memberSchema = new mongoose.Schema({
  username: { type: String, required: true, trim: true },
  phoneNo: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  dailyExercise: { type: String, required: true },
  dailyDiet: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Member', memberSchema);
