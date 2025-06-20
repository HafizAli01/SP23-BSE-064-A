const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// Home page
router.get('/', async (req, res) => {
  try {
    const products = await Product.find().limit(10);
    res.render('index', {
      title: 'Stone Island - Home',
      products: products, // Show first 10 products
      layout: 'layouts/main'
    });
  } catch (error) {
    console.error('Error loading home page:', error);
    res.render('index', {
      title: 'Stone Island - Home',
      products: [],
      layout: 'layouts/main'
    });
  }
});

// About page
router.get('/about', (req, res) => {
  res.render('about', {
    title: 'Stone Island - About',
    layout: 'layouts/main'
  });
});

// Contact page
router.get('/contact', (req, res) => {
  res.render('contact', {
    title: 'Stone Island - Contact',
    layout: 'layouts/main'
  });
});

module.exports = router;