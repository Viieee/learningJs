/* 
    ! the routes in this file is filtered with /admin
    
    ! every router method whether its post/get can have more than one handlers
    ! it will execute from left to right  
*/
const adminController = require("../controllers/admin");

const express = require("express");

// importing router
// ! router is used to handle the routing in express
const router = express.Router();

// route protection middleware
// ! this middleware will be put on the second argument on every router handler 
const isAuth = require("../middleware/is-auth");

// handling get request to /admin/add-product
router.get("/add-product", isAuth, adminController.getAddProduct);

// handling post request to /admin/add-product
router.post("/add-product", isAuth, adminController.postAddProduct);

// handling get request to /admin/products
router.get("/products", isAuth, adminController.getProducts);

// handling get request to /admin/edit-product
router.get("/edit-product/:productId", isAuth, adminController.getEditProduct);

// handling post request to /admin/edit-product
router.post("/edit-product", isAuth, adminController.postEditProduct);

// handling post request to /admin/delete-product
router.post("/delete-product", isAuth, adminController.postDeleteProduct);

module.exports = router;
