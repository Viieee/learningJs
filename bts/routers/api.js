const express = require('express');

const router = express.Router();
const rateLimit = require('express-rate-limit');

const apiController = require('../controllers/api');

const apiAuth = require('../middleware/api-auth');

const limiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// Apply the rate limiting middleware to requests
router.use(limiter);

router.post('/:projectId', apiAuth, apiController.postRequest);

module.exports = router;
