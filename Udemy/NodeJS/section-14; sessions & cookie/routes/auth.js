const express = require('express');

const authController = require('../controllers/auth');

const router = express.Router();

// get request to /login
router.get('/login', authController.getLogin);

// post request to /login
router.post('/login', authController.postLogin);

// post request to /logout
router.post('/logout', authController.postLogout);

module.exports = router;