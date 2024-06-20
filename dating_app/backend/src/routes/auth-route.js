const express = require('express');
const authController = require('../controllers/auth-controller');

const passport = require('passport');
const authenticateJWT=require("../middlewares/jwt")
const jwt = require('jsonwebtoken');
const router = express.Router();

router.post('/login',authController.login);
router.post('/phone/otp',authController.phoneAuthentication)
router.post('/otp/verification',authController.otpVerification)



router.get('/google',
    passport.authenticate('google', { scope: ['profile'] })
  );
  
  router.get('/google/callback', passport.authenticate('google', { failureRedirect: 'http://localhost:5173' }), (req, res) => {
    try {
      if (!req.user) {
        throw new Error('User not authenticated');
      }
      const token = jwt.sign({ id: req.user.id, username: req.user.username }, process.env.jwt_secreat, { expiresIn: '1h' });
console.log(token)

      res.cookie('jwt', token, { httpOnly: true, secure: false, sameSite: 'Lax' }); 
      res.redirect('http://localhost:5173/profile');
    } catch (err) {
      console.error('Error in Google OAuth callback:', err);
      res.status(500).json({ success: false, message: 'Error during Google OAuth callback' });
    }
  });

  
  
  router.get('/current_user',passport.authenticate, (req, res) => {
 
 console.log('user')
 
    {/*    if (req.user) {
      res.status(200).json({
        success: true,
        message: "successfull",
        user: req.user,
       
      });
    }
      */} 
  });
  


  router.post('/logout', (req, res) => {
    req.logout(req, () => {
      res.status(200).json({ success: true, message: 'Logged out successfully' });
    });
  });





module.exports = router;
