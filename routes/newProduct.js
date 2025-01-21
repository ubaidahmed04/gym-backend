const express = require('express');
const product = require('../models/newProduct.js');
const router = express.Router();

// add a product
router.post('/', async (req, res) => {
    try {
      const { productName, price, description, quantity } = req.body;
  
      // Check if all fields are provided and not empty
      if (!productName?.trim() || !price?.trim() || !description?.trim() || !quantity?.trim()) {
        return res.status(400).json({ 
          message: 'All fields are required. Please provide productName, price, description, and quantity.' 
        });
      }
  
      // Create and save the product
      const newproduct = new product({ productName, price, description, quantity });
      await newproduct.save();
  
      res.status(201).json({ message: 'Product Add successfully', product: newproduct });
    } catch (err) {
      console.error('Error add product:', err);
  
      // Handle duplicate key error
      if (err.code === 11000) {
        return res.status(400).json({ message: 'Duplicate value detected for unique fields', error: err.keyValue });
      }
  
      res.status(500).json({ message: 'Failed to add product', error: err.message });
    }
  });
  
// Get All products
router.get('/', async (req, res) => {
  try {
    const products = await product.find().select('-__v');
    res.json(products);
  } catch (err) {
    console.error('Error fetching products:', err);
    res.status(500).json({ message: 'Failed to fetch products', error: err.message });
  }
});

module.exports = router;
