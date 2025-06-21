const express = require('express');
const router = express.Router();
const Vehicle = require('../models/Vehicle');

// Display all vehicles (public access)
router.get('/', async (req, res) => {
  try {
    const vehicles = await Vehicle.find({ inStock: true }).sort({ createdAt: -1 });
    res.render('vehicles/index', { vehicles });
  } catch (error) {
    req.flash('error_msg', 'Error loading vehicles');
    res.redirect('/');
  }
});

// Display single vehicle details (public access)
router.get('/:id', async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) {
      req.flash('error_msg', 'Vehicle not found');
      return res.redirect('/vehicles');
    }
    res.render('vehicles/single', { vehicle });
  } catch (error) {
    req.flash('error_msg', 'Error loading vehicle');
    res.redirect('/vehicles');
  }
});

module.exports = router; 