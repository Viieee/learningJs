const UserModel = require('../models/user');
const bcrypt = require('bcryptjs');
const ExpressValidator = require('express-validator');

exports.signup = (req, res, next) => {
  const errors = ExpressValidator.validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed!');
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }
  const userName = req.body.userName;
  const email = req.body.email;
  const password = req.body.password;

  bcrypt
    .hash(password, 12)
    .then((hashedPassword) => {
      const user = new UserModel({
        userName: userName,
        email: email,
        password: hashedPassword,
        projects: [],
        tickets: [],
        notifications: [],
      });
      return user.save();
    })
    .then((result) => {
      console.log(result);
      res.status(201).json({
        message: 'signup successfull, user created!',
        userId: result._id,
      });
    })
    .catch((err) => {
      if (err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    })
};

exports.login = (req, res, next) => {
  // extracting the data from the login form
  const email = req.body.email;
  const password = req.body.password;
};
