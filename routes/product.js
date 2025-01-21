const express = require('express');
const Product = require('../models/product.js'); // Ensure correct import path
const { upload } = require('../utils/cloudinary.js'); // Use the upload configuration from your utils
const router = express.Router();

// Create a new product
router.post('/add', upload.array('images', 5), async (req, res) => {
  console.log('Headers:', req.headers);    // Check headers
  console.log('Body:', req.body);          // Log form data
  console.log('Files:', req.files);  
  try {
    const { name, description, price, } = req.body;

    // Check if all required fields are provided
    if (!name || !description || !price ) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    console.log('Files:', req.images);
    if (!req.images || req.images.length === 0) {
      return res.status(400).json({ message: 'No files uploaded' });
    }
    console.log("files", req.files)
    // The uploaded files are now in req.files, and Cloudinary has uploaded them
    const imageUrls = req.files.map(file => file.path);  // Extract the URLs from the Cloudinary response
    console.log("url -->>>>>", imageUrls)
    // Create a new product instance
    const newProduct = new Product({
      name,
      description,
      price,
      images: imageUrls,  // Store the URLs of the images
    });
    console.log("new ", newProduct)
    // Save the product to the database
    await newProduct.save();

    // Respond with the created product
    res.status(201).json({ message: 'Product added successfully', newProduct });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all products
router.get('/all', async (req, res) => {
  try {
    const products = await Product.find(); // Retrieve all products from the database
    res.status(200).json(products); // Send back the list of products
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});


// delete product by id 
router.delete('/delete/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    await Product.findByIdAndDelete(id);
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
