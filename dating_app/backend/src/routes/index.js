const express = require('express');
const authRoutes = require('./auth-route');
const profileRoutes=require('./profile-route')

const router = express.Router();

router.use('/auth', authRoutes);

router.use('/personal',profileRoutes)

module.exports = router;