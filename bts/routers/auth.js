const express = require('express');

const router = express.Router();

const ExpressValidator = require('express-validator');

const authController = require('../controllers/auth');

const checkAuth = require('../middleware/check-auth');

router.post(
  '/signup',
  [
    ExpressValidator.check('email')
      .isEmail()
      .withMessage('please enter a valid email')
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

router.post(
  '/signin',
  [
    (ExpressValidator.check('email')
      .isEmail()
      .withMessage('please enter a valid email')
      .normalizeEmail()
      .trim(),
    // validating password middleware
    ExpressValidator.check(
      'password',
      'Please enter a password with at least 7 characters'
    )
      .isLength({ min: 7 })
      // sanitizing
      .trim()),
  ],
  authController.login
);

router.post('/forget-password', authController.postReset);

router.get('/new-password/:token', authController.getPasswordPage);

router.post('/new-password/:token', authController.postNewPassword);

router.get('/verify-account/:token', authController.verifyAccount);

router.get('/user', checkAuth, authController.getUser);

router.patch('/user/:userId', checkAuth, authController.editUser);

module.exports = router;
