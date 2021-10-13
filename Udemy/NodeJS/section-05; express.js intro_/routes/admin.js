/* 
    ! the routes in this file is filtered with /admin
*/
const path = require("path");

const rootDir = require("../util/path");

const express = require("express");

// importing router
// ! router is used to handle the routing in express
const router = express.Router();

// handling get request to /admin/add-product
router.get("/add-product", (req, res, next) => {
  // sending response
  res.sendFile(path.join(rootDir, "views", "add-product.html"));
  /* 
    ! rootDir replaces __dirname, '../'
  */
});

// handling post request to /admin/add-product
router.post("/add-product", (req, res, next) => {
  // extracting the data sent by user
  // ! by default, request doesn't try to parse the incoming request body. We need parser to parse it
  console.log(req.body);
  res.redirect("/");
});

module.exports = router;
