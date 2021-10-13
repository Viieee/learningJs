const shopController = require("../controllers/shop");

const express = require("express");

// importing router
const router = express.Router();

// handling get request to /
router.get("/", shopController.getIndex);

// handling get request to /products
router.get("/products", shopController.getProducts);

// handling get request to /products/(id)
router.get("/products/:productId", shopController.getAProduct);

// handling get request to /cart
router.get("/cart", shopController.getCart);

// handling post request to /cart
router.post("/cart", shopController.postCart);

// handling post request to /cart-delete-item
router.post('/cart-delete-item', shopController.postCartDelete)

// handling get request to /orders
router.get("/orders", shopController.getOrders);

// handling get request to /checkout
router.get("/checkout", shopController.getCheckout);

module.exports = router;
