const productsController = require('../controllers/products');

const express = require("express");

// importing router
// ! router is used to handle the routing in express
const router = express.Router();

// handling get request to /
router.get("/", productsController.getProducts);

module.exports = router;
