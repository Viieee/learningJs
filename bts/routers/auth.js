const express = require('express');

const router = express.Router();

const ExpressValidator = require('express-validator');

const authController = require('../controllers/auth');

router.post('/signup', authController.signup);

module.exports = router;
