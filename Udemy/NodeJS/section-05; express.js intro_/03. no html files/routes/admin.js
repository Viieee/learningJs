/* 
    ! the routes in this file is filtered with /admin
*/
const express = require("express");

// importing router
// ! router is used to handle the routing in express
const router = express.Router();

// handling get request to /admin/add-product
router.get("/add-product", (req, res, next) => {
    // sending response
    res.send(
      '<h1>Add product page</h1> <form action="/admin/add-product" method="POST"><input type="text" name="title"><button type="submit">Add Product</button></form>'
    );
  });

// handling post request to /admin/add-product
router.post("/add-product", (req, res, next) => {
    // extracting the data sent by user
    // ! by default, request doesn't try to parse the incoming request body. We need parser to parse it
    console.log(req.body);
    res.redirect('/')
});

module.exports = router;