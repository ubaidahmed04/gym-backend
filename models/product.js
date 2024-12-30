// const mongoose = require('mongoose');

// const productSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   description: { type: String, required: true },
//   price: { type: Number, required: true },
// });

// module.exports = mongoose.model('Product', productSchema);





const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  comparePrice: { type: Number }, // Optional field for compare price
  images: { type: [String], required: true }, // Array of image URLs
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to the user
  category: { type: String, required: true }
});

module.exports = mongoose.model('Product', productSchema);
