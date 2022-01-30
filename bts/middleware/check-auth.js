require('dotenv').config();
const jwt = require('jsonwebtoken');
const User = require('../models/user');

module.exports = async (req, res, next) => {
  if (req.method === 'OPTIONS') {
    return next();
  }
  try {
    const token = req.headers.authorization.split(' ')[1]; // Authorization: 'Bearer TOKEN'
    if (!token) {
      throw new Error('Authentication failed!');
    }
    const decodedToken = jwt.verify(token, process.env.SECRET);
    let checkUser = await User.findById(decodedToken.userId);
    if (!checkUser) {
      throw new Error("Authentication failed!");
    }
    req.userId = decodedToken.userId;
    next();
  } catch (err) {
    const error = new Error('Authentication failed!');
    error.statusCode = 403;
    return next(error);
  }
};
