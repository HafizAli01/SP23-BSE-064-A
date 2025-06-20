const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Order = require('../models/Order');
const adminAuth = require('../middleware/admin');

// List all products
router.get('/products', adminAuth, async (req, res) => {
  const products = await Product.find();
  res.render('admin/products', { products });
});

// Add product form
router.get('/products/add', adminAuth, (req, res) => {
  res.render('admin/add-product');
});

// Add product POST
router.post('/products/add', adminAuth, async (req, res) => {
  const { name, price, description, image } = req.body;
  await Product.create({ name, price, description, image });
  res.redirect('/admin/products');
});

// Edit product form
router.get('/products/edit/:id', adminAuth, async (req, res) => {
  const product = await Product.findById(req.params.id);
  res.render('admin/edit-product', { product });
});

// Edit product POST
router.post('/products/edit/:id', adminAuth, async (req, res) => {
  const { name, price, description, image } = req.body;
  await Product.findByIdAndUpdate(req.params.id, { name, price, description, image });
  res.redirect('/admin/products');
});

// Delete product
router.post('/products/delete/:id', adminAuth, async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.redirect('/admin/products');
});

// List all orders
router.get('/orders', adminAuth, async (req, res) => {
  const orders = await Order.find().populate('user');
  res.render('admin/orders', { orders });
});

// (Optional) Update order status
router.post('/orders/status/:id', adminAuth, async (req, res) => {
  const { status } = req.body;
  await Order.findByIdAndUpdate(req.params.id, { status });
  res.redirect('/admin/orders');
});

module.exports = router; 