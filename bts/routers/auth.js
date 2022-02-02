const express = require('express');

const router = express.Router();

const authController = require('../controllers/auth');

const checkAuth = require('../middleware/check-auth');

router.post('/signup', authController.signup);

router.post('/signin', authController.login);

router.post('/forget-password', authController.postReset);

router.get('/new-password/:token', authController.getPasswordPage);

router.post('/new-password/:token', authController.postNewPassword);

router.get('/verify-account/:token', authController.verifyAccount);

router.get('/user', checkAuth, authController.getUser);

router.post('/user/notifications', checkAuth, authController.readAllNoti);

router.patch('/user/:userId', checkAuth, authController.editUser);

router.patch('/user/:userId/password', checkAuth, authController.editPassword);

module.exports = router;
