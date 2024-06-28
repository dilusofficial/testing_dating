const express = require('express');
const authRoutes = require('./auth-route');
const profileRoutes=require('./profile-route')

const router = express.Router();

router.use('/auth', authRoutes);

router.use('/personal',profileRoutes)




router.get('/profile', (req, res) => {
    if (req.session && req.session.user) {
      const userId = req.session.user.id;
      res.status(200).json({ message: `Session cookie present for user ${userId}` });
    } else {
      res.status(401).json({ message: 'Session cookie not found' });
    }
  });
  

module.exports = router;