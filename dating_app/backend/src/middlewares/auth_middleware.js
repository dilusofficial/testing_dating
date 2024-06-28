const ensureAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        console.log('Authenticated user:', req.user);   
      return next();
    }
    console.log("not authenticated")
    res.status(401).json({ message: 'Authentication required' });
  };
  
  module.exports = ensureAuthenticated;