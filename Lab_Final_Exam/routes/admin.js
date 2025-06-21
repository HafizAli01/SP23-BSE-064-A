const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Vehicle = require('../models/Vehicle');
const Order = require('../models/Order');
const adminAuth = require('../middleware/admin');
const multer = require('multer');
const path = require('path');

// Multer configuration for image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/Images/vehicles/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'vehicle-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: function (req, file, cb) {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'));
    }
  }
});

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

// Vehicle Routes
// List all vehicles
router.get('/vehicles', adminAuth, async (req, res) => {
  try {
    const vehicles = await Vehicle.find().sort({ createdAt: -1 });
    res.render('admin/vehicles/index', { vehicles });
  } catch (error) {
    req.flash('error_msg', 'Error loading vehicles');
    res.redirect('/admin');
  }
});

// Add vehicle form
router.get('/vehicles/add', adminAuth, (req, res) => {
  res.render('admin/vehicles/add');
});

// Add vehicle POST
router.post('/vehicles/add', adminAuth, upload.single('image'), async (req, res) => {
  try {
    const { name, brand, price, type, description } = req.body;
    
    if (!req.file) {
      req.flash('error_msg', 'Please upload an image');
      return res.redirect('/admin/vehicles/add');
    }

    const imagePath = '/Images/vehicles/' + req.file.filename;
    
    await Vehicle.create({ 
      name, 
      brand, 
      price: parseFloat(price), 
      type, 
      description,
      image: imagePath 
    });
    
    req.flash('success_msg', 'Vehicle added successfully');
    res.redirect('/admin/vehicles');
  } catch (error) {
    req.flash('error_msg', 'Error adding vehicle');
    res.redirect('/admin/vehicles/add');
  }
});

// Edit vehicle form
router.get('/vehicles/edit/:id', adminAuth, async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) {
      req.flash('error_msg', 'Vehicle not found');
      return res.redirect('/admin/vehicles');
    }
    res.render('admin/vehicles/edit', { vehicle });
  } catch (error) {
    req.flash('error_msg', 'Error loading vehicle');
    res.redirect('/admin/vehicles');
  }
});

// Edit vehicle POST
router.post('/vehicles/edit/:id', adminAuth, upload.single('image'), async (req, res) => {
  try {
    const { name, brand, price, type, description } = req.body;
    const updateData = { 
      name, 
      brand, 
      price: parseFloat(price), 
      type, 
      description 
    };

    // If new image is uploaded, update the image path
    if (req.file) {
      updateData.image = '/Images/vehicles/' + req.file.filename;
    }

    await Vehicle.findByIdAndUpdate(req.params.id, updateData);
    
    req.flash('success_msg', 'Vehicle updated successfully');
    res.redirect('/admin/vehicles');
  } catch (error) {
    req.flash('error_msg', 'Error updating vehicle');
    res.redirect('/admin/vehicles/edit/' + req.params.id);
  }
});

// Delete vehicle
router.post('/vehicles/delete/:id', adminAuth, async (req, res) => {
  try {
    await Vehicle.findByIdAndDelete(req.params.id);
    req.flash('success_msg', 'Vehicle deleted successfully');
    res.redirect('/admin/vehicles');
  } catch (error) {
    req.flash('error_msg', 'Error deleting vehicle');
    res.redirect('/admin/vehicles');
  }
});

module.exports = router; 