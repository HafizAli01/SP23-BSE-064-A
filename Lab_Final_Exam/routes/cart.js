const express = require('express');
const Product = require('../models/Product');
const router = express.Router();

// Test cart route
router.get('/test', (req, res) => {
  const cart = req.session.cart || [];
  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  res.render('cart-test', {
    title: 'Cart Test',
    cart: cart,
    total: total,
    user: req.session.user || null,
    layout: false
  });
});

// View cart
router.get('/', (req, res) => {
  try {
    console.log('Cart route accessed');
    console.log('Session cart:', req.session.cart);
    console.log('Session user:', req.session.user);
    
    const cart = req.session.cart || [];
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    console.log('Cart items:', cart.length);
    console.log('Total:', total);
    
    res.render('cart', {
      title: 'Shopping Cart',
      cart: cart,
      total: total,
      user: req.session.user || null,
      layout: false
    });
  } catch (error) {
    console.error('Error in cart route:', error);
    res.status(500).render('error', { 
      title: 'Error',
      message: 'An error occurred while loading the cart',
      layout: false
    });
  }
});

// Add to cart
router.post('/add/:productId', async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity = 1 } = req.body;
    
    console.log('Adding to cart:', productId, quantity);
    
    // Find product
    const product = await Product.findById(productId);
    if (!product) {
      req.flash('error_msg', 'Product not found');
      return res.redirect('/');
    }
    
    // Initialize cart if not exists
    if (!req.session.cart) {
      req.session.cart = [];
    }
    
    // Check if product already in cart
    const existingItemIndex = req.session.cart.findIndex(item => 
      item.productId.toString() === productId
    );
    
    if (existingItemIndex > -1) {
      // Update quantity
      req.session.cart[existingItemIndex].quantity += parseInt(quantity);
    } else {
      // Add new item
      req.session.cart.push({
        productId: product._id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: parseInt(quantity)
      });
    }
    
    console.log('Cart after adding:', req.session.cart);
    
    req.flash('success_msg', 'Product added to cart successfully!');
    res.redirect('/cart');
  } catch (error) {
    console.error('Add to cart error:', error);
    req.flash('error_msg', 'Failed to add product to cart');
    res.redirect('/');
  }
});

// Remove item from cart (POST)
router.post('/remove/:productId', (req, res) => {
  try {
    const { productId } = req.params;
    
    console.log('Removing from cart:', productId);
    
    if (!req.session.cart) {
      req.flash('error_msg', 'Cart is empty');
      return res.redirect('/cart');
    }
    
    const itemIndex = req.session.cart.findIndex(item => 
      item.productId.toString() === productId
    );
    
    if (itemIndex > -1) {
      req.session.cart.splice(itemIndex, 1);
      req.flash('success_msg', 'Item removed from cart');
    } else {
      req.flash('error_msg', 'Item not found in cart');
    }
    
    res.redirect('/cart');
  } catch (error) {
    console.error('Remove from cart error:', error);
    req.flash('error_msg', 'Error removing item from cart');
    res.redirect('/cart');
  }
});

// Clear cart (POST)
router.post('/clear', (req, res) => {
  try {
    console.log('Clearing cart');
    req.session.cart = [];
    req.flash('success_msg', 'Cart cleared successfully');
    res.redirect('/cart');
  } catch (error) {
    console.error('Clear cart error:', error);
    req.flash('error_msg', 'Error clearing cart');
    res.redirect('/cart');
  }
});

// Update cart item quantity
router.put('/update/:productId', (req, res) => {
  const { productId } = req.params;
  const { quantity } = req.body;
  
  if (!req.session.cart) {
    return res.status(400).json({ error: 'Cart is empty' });
  }
  
  const itemIndex = req.session.cart.findIndex(item => 
    item.productId.toString() === productId
  );
  
  if (itemIndex > -1) {
    if (parseInt(quantity) <= 0) {
      // Remove item if quantity is 0 or negative
      req.session.cart.splice(itemIndex, 1);
    } else {
      // Update quantity
      req.session.cart[itemIndex].quantity = parseInt(quantity);
    }
    
    const total = req.session.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    res.json({
      success: true,
      cart: req.session.cart,
      total: total.toFixed(2)
    });
  } else {
    res.status(404).json({ error: 'Item not found in cart' });
  }
});

// Remove item from cart (DELETE - for AJAX)
router.delete('/remove/:productId', (req, res) => {
  const { productId } = req.params;
  
  if (!req.session.cart) {
    return res.status(400).json({ error: 'Cart is empty' });
  }
  
  const itemIndex = req.session.cart.findIndex(item => 
    item.productId.toString() === productId
  );
  
  if (itemIndex > -1) {
    req.session.cart.splice(itemIndex, 1);
    
    const total = req.session.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    res.json({
      success: true,
      cart: req.session.cart,
      total: total.toFixed(2)
    });
  } else {
    res.status(404).json({ error: 'Item not found in cart' });
  }
});

// Clear cart (DELETE - for AJAX)
router.delete('/clear', (req, res) => {
  req.session.cart = [];
  res.json({ success: true });
});

module.exports = router; 