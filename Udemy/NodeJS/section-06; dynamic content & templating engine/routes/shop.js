const path = require("path");

const rootDir = require("../util/path");

const express = require("express");

const adminData = require('./admin')

// importing router
// ! router is used to handle the routing in express
const router = express.Router();

// handling get request to /
router.get("/", (req, res, next) => {
  // extracting the products stored in admin.js
  const products = adminData.products;
  // sending response
  res.render('shop', {
    prods: products,
    pageTitle: 'Shop',
    path: '/'
  });
});

module.exports = router;
