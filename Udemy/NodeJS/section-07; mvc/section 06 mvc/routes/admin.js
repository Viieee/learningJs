/* 
    ! the routes in this file is filtered with /admin
*/
const productsController = require("../controllers/products");

const express = require("express");

// importing router
// ! router is used to handle the routing in express
const router = express.Router();

// handling get request to /admin/add-product
router.get("/add-product", productsController.getAddProduct);

// handling post request to /admin/add-product
router.post("/add-product", productsController.postAddProduct);

module.exports = router;
