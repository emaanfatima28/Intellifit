const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      if (decoded.id === 'admin') {
        req.user = {
          _id: 'admin',
          name: 'Admin',
          email: process.env.ADMIN_EMAIL,
          role: 'admin'
        };
      } else {
        req.user = await User.findById(decoded.id).select('-password');
      }

      next(); 
    } catch (error) {
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

module.exports = protect;
