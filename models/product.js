// models/Product.js
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    images: { type: [String],required: true}, // Array of image URLs
    // createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User',  }, // Reference to the user
  },
  { timestamps: true } // Adds createdAt and updatedAt fields automatically
);

module.exports = mongoose.model('Product', productSchema);
