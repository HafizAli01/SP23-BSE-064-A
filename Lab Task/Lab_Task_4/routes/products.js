const express = require('express');
const Product = require('../models/Product');
const router = express.Router();

// Get all products
router.get('/', async (req, res) => {
  try {
    const { search, category, sort, page = 1, limit = 12 } = req.query;
    const skip = (page - 1) * limit;
    
    // Build query
    let query = {};
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }
    if (category) {
      query.category = category;
    }
    
    // Build sort
    let sortOption = {};
    if (sort === 'price-low') {
      sortOption = { price: 1 };
    } else if (sort === 'price-high') {
      sortOption = { price: -1 };
    } else if (sort === 'name') {
      sortOption = { name: 1 };
    } else {
      sortOption = { createdAt: -1 }; // Default: newest first
    }
    
    const products = await Product.find(query)
      .sort(sortOption)
      .limit(parseInt(limit))
      .skip(skip);
    
    const total = await Product.countDocuments(query);
    const totalPages = Math.ceil(total / limit);
    
    res.render('products/index', {
      title: 'Stone Island - Products',
      products,
      currentPage: parseInt(page),
      totalPages,
      search,
      category,
      sort,
      layout: 'layouts/main'
    });
  } catch (error) {
    console.error('Error loading products:', error);
    req.flash('error_msg', 'Failed to load products');
    res.redirect('/');
  }
});

// Get single product
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      req.flash('error_msg', 'Product not found');
      return res.redirect('/products');
    }
    
    // Get related products (same category)
    const relatedProducts = await Product.find({
      category: product.category,
      _id: { $ne: product._id }
    }).limit(4);
    
    res.render('products/single', {
      title: `Stone Island - ${product.name}`,
      product,
      relatedProducts,
      layout: 'layouts/layout'
    });
  } catch (error) {
    console.error('Error loading product:', error);
    req.flash('error_msg', 'Failed to load product');
    res.redirect('/products');
  }
});

// Search products (AJAX endpoint)
router.get('/api/search', async (req, res) => {
  try {
    const { q } = req.query;
    if (!q || q.length < 2) {
      return res.json({ products: [] });
    }
    
    const products = await Product.find({
      name: { $regex: q, $options: 'i' }
    }).limit(5);
    
    res.json({ products });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: 'Search failed' });
  }
});

// Get products by category
router.get('/category/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const { page = 1, limit = 12 } = req.query;
    const skip = (page - 1) * limit;
    
    const products = await Product.find({ category })
      .limit(parseInt(limit))
      .skip(skip);
    
    const total = await Product.countDocuments({ category });
    const totalPages = Math.ceil(total / limit);
    
    res.render('products/index', {
      title: `Stone Island - ${category}`,
      products,
      currentPage: parseInt(page),
      totalPages,
      category,
      layout: 'layouts/main'
    });
  } catch (error) {
    console.error('Error loading category products:', error);
    req.flash('error_msg', 'Failed to load products');
    res.redirect('/products');
  }
});

module.exports = router;
