const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { requireGuest } = require('../middleware/auth');

// Login page
router.get('/login', requireGuest, (req, res) => {
  res.render('auth/login', {
    title: 'Stone Island - Login',
    layout: 'layouts/auth',
    errors: [],
    redirect: req.query.redirect || '/',
    user: req.session.user
  });
});

// Register page
router.get('/register', requireGuest, (req, res) => {
  res.render('auth/register', {
    title: 'Stone Island - Register',
    layout: 'layouts/auth',
    errors: [],
    user: req.session.user
  });
});

// Login POST
router.post('/login', [
  body('email').isEmail().normalizeEmail().withMessage('Please enter a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.render('auth/login', {
        title: 'Stone Island - Login',
        layout: 'layouts/auth',
        errors: errors.array(),
        redirect: req.body.redirect || '/',
        user: req.session.user
      });
    }

    const { email, password } = req.body;
    const user = await User.findByEmail(email);

    if (!user) {
      return res.render('auth/login', {
        title: 'Stone Island - Login',
        layout: 'layouts/auth',
        errors: [{ msg: 'Invalid email or password' }],
        redirect: req.body.redirect || '/',
        user: req.session.user
      });
    }

    const isValidPassword = await User.validatePassword(password, user.password);
    if (!isValidPassword) {
      return res.render('auth/login', {
        title: 'Stone Island - Login',
        layout: 'layouts/auth',
        errors: [{ msg: 'Invalid email or password' }],
        redirect: req.body.redirect || '/',
        user: req.session.user
      });
    }

    // Set session
    req.session.user = {
      id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      isAdmin: user.isAdmin
    };

    const redirectUrl = req.body.redirect || '/';
    req.flash('success_msg', 'Login successful!');
    res.redirect(redirectUrl);
  } catch (error) {
    console.error('Login error:', error);
    res.render('auth/login', {
      title: 'Stone Island - Login',
      layout: 'layouts/auth',
      errors: [{ msg: 'An error occurred. Please try again.' }],
      redirect: req.body.redirect || '/',
      user: req.session.user
    });
  }
});

// Register POST
router.post('/register', [
  body('firstName').trim().isLength({ min: 2 }).withMessage('First name must be at least 2 characters'),
  body('lastName').trim().isLength({ min: 2 }).withMessage('Last name must be at least 2 characters'),
  body('email').isEmail().normalizeEmail().withMessage('Please enter a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('confirmPassword').custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error('Passwords do not match');
    }
    return true;
  })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.render('auth/register', {
        title: 'Stone Island - Register',
        layout: 'layouts/auth',
        errors: errors.array(),
        user: req.session.user
      });
    }

    const { firstName, lastName, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.render('auth/register', {
        title: 'Stone Island - Register',
        layout: 'layouts/auth',
        errors: [{ msg: 'User with this email already exists' }],
        user: req.session.user
      });
    }
    
    // Create new user (password will be hashed automatically)
    const user = new User({
      firstName,
      lastName,
      email,
      password
    });
    
    await user.save();
    
    req.flash('success_msg', 'Registration successful! Please login.');
    res.redirect('/auth/login');
  } catch (error) {
    console.error('Registration error:', error);
    res.render('auth/register', {
      title: 'Stone Island - Register',
      layout: 'layouts/auth',
      errors: [{ msg: 'An error occurred. Please try again.' }],
      user: req.session.user
    });
  }
});

// Logout
router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Logout error:', err);
    }
    res.redirect('/');
  });
});

module.exports = router;