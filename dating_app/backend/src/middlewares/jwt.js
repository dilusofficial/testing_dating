const jwt = require('jsonwebtoken');

require('dotenv').config();
const SECRET_KEY = process.env.jwt_secreat;

const authenticateJWT = (req, res, next) => {
  const token = req.cookies.jwt;

  if (token) {
    jwt.verify(token, SECRET_KEY, (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }
      req.user = user;
      next();
    });
  } else {
    res.sendStatus(401);
  }
};

module.exports = authenticateJWT;