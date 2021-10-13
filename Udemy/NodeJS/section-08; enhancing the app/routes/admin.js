/* 
    ! the routes in this file is filtered with /admin
*/
const adminController = require("../controllers/admin");

const express = require("express");

// importing router
// ! router is used to handle the routing in express
const router = express.Router();

// handling get request to /admin/add-product
router.get("/add-product", adminController.getAddProduct);

// handling get request to /admin/products
router.get("/products", adminController.getProducts);

// handling post request to /admin/add-product
router.post("/add-product", adminController.postAddProduct);

module.exports = router;
