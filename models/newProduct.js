const mongoose = require('mongoose');

// Define product Schema
const newProductSchema = new mongoose.Schema({
  productName: { type: String, required: true, trim: true },
  price: { type: String, required: true, unique: true },
  description: { type: String, required: true, unique: true, lowercase: true },
  quantity: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('newProduct', newProductSchema );
