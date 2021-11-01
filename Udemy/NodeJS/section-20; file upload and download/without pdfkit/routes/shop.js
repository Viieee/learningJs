/* 
    ! every router method whether its post/get can have more than one handlers
    ! it will execute from left to right  
*/
const shopController = require("../controllers/shop");

const express = require("express");

// importing router
// ! router is used to handle the routing in express
const router = express.Router();

// route protection middleware
// ! this middleware will be put on the second argument on every router handler 
const isAuth = require("../middleware/is-auth");

// handling get request to /
router.get("/", shopController.getIndex);

// handling get request to /products
router.get("/products", shopController.getProducts);

// handling get request to /products/(id)
router.get("/products/:productId", shopController.getAProduct);
// ! :productId is the variable segment, it tells express that it can be anything
// ! the order matters if we use variable segment in one of our route

// handling get request to /cart
router.get("/cart", isAuth, shopController.getCart);

// handling post request to /cart
router.post("/cart", isAuth, shopController.postCart);

// handling post request to /cart-delete-item
router.post("/cart-delete-item", isAuth, shopController.postCartDelete);

// handling get request to /orders
router.get("/orders", isAuth, shopController.getOrders);

// handling post request to /create-order
router.post("/create-order", isAuth, shopController.postOrder);

// handling get orders to the invoice /orders/(id)
router.get("/orders/:orderId", isAuth, shopController.getInvoice)
// ! orderId is the variable segment, it tells express that it can be anything

module.exports = router;
