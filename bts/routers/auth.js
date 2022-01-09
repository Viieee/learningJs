const express = require('express');

const router = express.Router();

const ExpressValidator = require('express-validator');

const authController = require('../controllers/auth');
const UserModel = require('../models/user');

router.post(
  '/signup',
  [
    ExpressValidator.check('email')
      .isEmail()
      .withMessage('please enter a valid email')
      .custom((value, { req }) => {
        return UserModel.findOne({ email: value }).then((userData) => {
          if (userData) {
            // if the user inserted in the email field already existed in the database
            return Promise.reject(
              'email already registered, please pick a different one'
            );
          }
        });
      })
      .normalizeEmail()
      .trim(),
    // validating password middleware
    ExpressValidator.check(
      'password',
      'Please enter a password with at least 7 characters'
    )
      .isLength({ min: 7 })
      // sanitizing
      .trim(),
    ExpressValidator.check('userName').trim().not().isEmpty(),
  ],
  authController.signup
);

router.post('/login');

module.exports = router;
