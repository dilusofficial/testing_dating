const express = require('express');
const passport = require('passport');
const router = express.Router();
const jwt = require('jsonwebtoken');
require('dotenv').config();
const User=require('../models/model')
router.get('/google', passport.authenticate('google', { scope: ['profile'] }));

router.get('/google/callback', passport.authenticate('google', { failureRedirect: 'http://localhost:5173' }), (req, res) => {
  console.log('Authenticated user:', req.user);


  const token = jwt.sign({ userId: req.user.id }, process.env.SESSION_SECRET, { expiresIn: '3h' });


  res.cookie('token', token, { httpOnly: true, secure: false, maxAge: 3600000 }); 

 
  res.redirect('http://localhost:5173/profile');
});

router.get('/current_user', async (req, res) => {
  const token = req.cookies.token;

  console.log('Token:', token);

  if (!token) {
    console.log('User not authenticated: No token found');
    return res.status(401).json({
      authenticated: false,
      message: 'User not authenticated',
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.SESSION_SECRET);
    console.log('Decoded token:', decoded);
    
    try {
      const user = await User.findById(decoded.userId);
      if (!user) {
        console.log('User not authenticated: User not found');
        return res.status(401).json({
          authenticated: false,
          message: 'User not authenticated',
        });
      }

      console.log('Authenticated user:', user);
      return res.status(200).json({
        authenticated: true,
        message: 'User authenticated and logged to console'
      });
    } catch (err) {
      console.error('Database error:', err);
      return res.status(500).json({
        authenticated: false,
        message: 'Database error',
      });
    }
  } catch (err) {
    console.error('Token verification error:', err);
    return res.status(401).json({
      authenticated: false,
      message: 'User not authenticated',
    });
  }
});

router.post('/logout', (req, res) => {
  res.clearCookie('token'); 
  req.logout(() => {
    res.status(200).json({ success: true, message: 'Logged out successfully' });
  });
});

module.exports = router;
