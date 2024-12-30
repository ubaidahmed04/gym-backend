const express = require('express');
const Product = require('../models/product.js');
const authMiddleware = require('../middlewares/authmiddleware.js');
const router = express.Router();
const { cloudinary, upload } = require('../utils/cloudinary.js');
const mongoose = require('mongoose');

// Add Product
router.post('/', authMiddleware, upload.array('images', 5), async (req, res) => {
  try {
    const { name, description, price, comparePrice, category } = req.body;
    const imageUrls = req.files.map(file => file.path);
    const product = new Product({
      name,
      description,
      price,
      comparePrice,
      images: imageUrls,
      category,
      createdBy: req.user
    });
    await product.save();
    res.status(201).json({ message: 'Product Add Successfully', product });
  } catch (err) {
    res.status(500).json({ message: 'Failed to add product', error: err.message });
  }
});

// Get Products
// router.get('/', async (req, res) => {
//   try {
//     const products = await Product.find().select('-__v');
//     res.json(products);
//   } catch (err) {
//     res.status(500).json({ message: 'Failed to fetch products', error: err.message });
//   }
// });
// router.get('/', async (req, res) => {
//   try {
//     const category = req.query.category;
    
//     // Create the query object based on the category (optional filter)
//     const query = category ? { category } : {};

//     // Fetch up to 20 products with the optional category filter
//     const products = await Product.find(query)
//       .limit(10) // Limit to 20 products
//       .select('-__v');

//     res.json(products);
//   } catch (err) {
//     res.status(500).json({ message: 'Failed to fetch products', error: err.message });
//   }
// });
// router.get('/', async (req, res) => {
//   try {
//     const category = req.query.category; // Optional category filter
//     const page = parseInt(req.query.page) || 1; 
//     const limit = req.query.limit ? parseInt(req.query.limit) : null; 

//     // Create the query object based on the category (optional filter)
//     const query = category ? { category } : {};

//     // Fetch the products with pagination
//     const products = await Product.find(query)
//       .skip((page - 1) * limit) // Skip products for previous pages
//       .limit(limit) 
//       .select('-__v');

//     // Get the total count of products for the query
//     const totalProducts = await Product.countDocuments(query);

//     res.json(
//       products
//       // currentPage: page,
//       // totalPages: Math.ceil(totalProducts / limit),
//       // totalProducts,
//     );
//   } catch (err) {
//     res.status(500).json({ message: 'Failed to fetch products', error: err.message });
//   }
// });

router.get('/', async (req, res) => {
  try {
    const category = req.query.category; // Optional category filter
    const skip = parseInt(req.query.skip) || 0; // Skip value, default to 0
    const limit = req.query.limit ? parseInt(req.query.limit) : null; // Custom limit if provided, otherwise null

    // Create the query object based on the category (optional filter)
    const query = category ? { category } : {};

    let productsQuery = Product.find(query).select('-__v');

    // Apply pagination only if limit is specified
    if (limit) {
      productsQuery = productsQuery.skip(skip).limit(limit);
    }

    const products = await productsQuery;

    // Get the total count of products for the query
    const totalProducts = await Product.countDocuments(query);

    res.json(
      products
    );
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch products', error: err.message });
  }
});




// GET SINGLE PRODUCT
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).select('-__v');
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch product', error: err.message });
  }
});

// Update Product
router.put('/:id', authMiddleware, upload.array('images', 5), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, comparePrice, category } = req.body;
    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    if (req.files.length > 0) {
      const oldImages = product.images;
      for (const imageUrl of oldImages) {
        const publicId = imageUrl.split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy(`products/${publicId}`);
      }
    }

    const newImageUrls = req.files.map(file => file.path);
    product.name = name || product.name;
    product.description = description || product.description;
    product.price = price || product.price;
    product.comparePrice = comparePrice || product.comparePrice;
    product.category = category || product.category;
    product.images = req.files.length > 0 ? newImageUrls : product.images;

    await product.save();
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update product', error: err.message });
  }
});

// Delete Product
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid product ID' });
    }

    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const images = product.images;
    for (const imageUrl of images) {
      const publicId = imageUrl.split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy(publicId);
    }

    await Product.findByIdAndDelete(id);
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete product', error: err.message });
  }
});

module.exports = router;