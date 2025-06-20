const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');
const { requireAuth } = require('../middleware/auth');

// My orders page (protected route)
router.get('/my-orders', requireAuth, async (req, res) => {
  try {
    const orders = await Order.find({ userEmail: req.session.user.email })
      .sort({ createdAt: -1 });
    res.render('orders/my-orders', {
      title: 'Stone Island - My Orders',
      orders: orders,
      layout: 'layouts/main'
    });
  } catch (error) {
    console.error('Error loading orders:', error);
    res.render('orders/my-orders', {
      title: 'Stone Island - My Orders',
      orders: [],
      layout: 'layouts/main'
    });
  }
});

// Create order (demo functionality)
router.post('/create', requireAuth, async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;
    const product = await Product.findById(productId);
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const order = new Order({
      userEmail: req.session.user.email,
      userName: req.session.user.firstName + ' ' + req.session.user.lastName,
      items: [{
        productId: product._id,
        name: product.name,
        price: product.price,
        quantity: parseInt(quantity),
        image: product.image
      }],
      totalAmount: product.price * parseInt(quantity),
      status: 'pending',
      paymentMethod: 'cash_on_delivery'
    });

    await order.save();
    res.redirect('/orders/my-orders');
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// View user's orders
router.get('/', requireAuth, async (req, res) => {
  try {
    const orders = await Order.find({ userEmail: req.session.user.email })
      .sort({ createdAt: -1 });
    
    res.render('orders', {
      orders,
      user: req.session.user
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    req.flash('error_msg', 'Failed to load orders');
    res.redirect('/');
  }
});

// View specific order details
router.get('/:orderId', requireAuth, async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.orderId,
      userEmail: req.session.user.email
    });
    
    if (!order) {
      req.flash('error_msg', 'Order not found');
      return res.redirect('/orders');
    }
    
    res.render('orders/order-details', {
      order,
      user: req.session.user,
      layout: 'layouts/layout'
    });
  } catch (error) {
    console.error('Error fetching order details:', error);
    req.flash('error_msg', 'Failed to load order details');
    res.redirect('/orders');
  }
});

module.exports = router;