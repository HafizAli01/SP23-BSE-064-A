const express = require('express');
const Order = require('../models/Order');
const { requireAuth } = require('../middleware/auth');
const router = express.Router();

// Checkout page
router.get('/', requireAuth, (req, res) => {
  const cart = req.session.cart || [];
  
  if (cart.length === 0) {
    req.flash('error_msg', 'Your cart is empty');
    return res.redirect('/cart');
  }
  
  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  res.render('checkout', {
    cart,
    total,
    user: req.session.user
  });
});

// Process order (Pay Later with Cash)
router.post('/place-order', requireAuth, async (req, res) => {
  try {
    const cart = req.session.cart || [];
    
    if (cart.length === 0) {
      req.flash('error_msg', 'Your cart is empty');
      return res.redirect('/cart');
    }
    
    const { name, phone, address } = req.body;
    
    // Validate required fields
    if (!name || !phone || !address) {
      req.flash('error_msg', 'Please fill in all required fields');
      return res.redirect('/checkout');
    }
    
    const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    // Create order
    const order = new Order({
      userEmail: req.session.user.email,
      userName: name,
      userPhone: phone,
      userAddress: address,
      items: cart.map(item => ({
        productId: item.productId,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image
      })),
      totalAmount: totalAmount,
      status: 'pending',
      paymentMethod: 'cash_on_delivery'
    });
    
    await order.save();
    
    // Clear cart
    req.session.cart = [];
    
    req.flash('success_msg', `Order placed successfully! Order number: ${order.orderNumber}`);
    res.redirect('/orders');
  } catch (error) {
    console.error('Order placement error:', error);
    req.flash('error_msg', 'Failed to place order. Please try again.');
    res.redirect('/checkout');
  }
});

module.exports = router; 