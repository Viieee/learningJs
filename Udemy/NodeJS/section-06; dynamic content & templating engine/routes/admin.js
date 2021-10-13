/* 
    ! the routes in this file is filtered with /admin
*/
const path = require("path");

const rootDir = require("../util/path");

const express = require("express");

const products = [];
/* 
  ! products will contain the products the user send and its in the form of an object
*/

// importing router
// ! router is used to handle the routing in express
const router = express.Router();

// handling get request to /admin/add-product
router.get("/add-product", (req, res, next) => {
  // sending response
  res.render('add-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product'
  });
});

// handling post request to /admin/add-product
router.post("/add-product", (req, res, next) => {
  // storing the data into products array
  products.push({ title: req.body.title });
  res.redirect("/");
});

exports.routes = router;
exports.products = products;
