const shopController = require("../controllers/shop");

const express = require("express");

// importing router
// ! router is used to handle the routing in express
const router = express.Router();

// handling get request to /
router.get("/", shopController.getIndex);

// handling get request to /products
router.get("/products", shopController.getProducts);

// handling get request to /cart
router.get("/cart", shopController.getCart);

// handling get request to /orders
router.get("/orders", shopController.getOrders)

// handling get request to /checkout
router.get("/checkout", shopController.getCheckout);

module.exports = router;
