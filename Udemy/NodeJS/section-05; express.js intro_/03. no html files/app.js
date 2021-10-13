// core modules
//// const http = require("http");

// 3rd party packages
const express = require("express");
const bodyParser = require("body-parser");

// importing files
// ! the router files is a valid middleware function
const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");

// initializing express object
const app = express();
/* 
    ? express package is returning a function,
    ? a function that if being called will initialize an express object,
    ? the object will store a lot of express logic,
    ! in our current case, the app constant will be the object
*/

// parsing the body
app.use(bodyParser.urlencoded({ extended: true }));
/* 
    ! this middleware will run no matter what
    ? extended: true use qs library
    ? extended: false use querystring library
    difference:

    querystring cannot parse nested object.
    Instead, it will be presented in [] format.
    While qs can be parsed in nested object.
*/

// routers middleware
app.use('/admin', adminRoutes);
/* 
  ? the first argument in the use method above is a filter for the route
  ? so every single route in the adminRoutes file will be filtered 

  example:
  route get /add-product -> get /admin/add-product 
*/
app.use(shopRoutes);

// 404 handler
app.use((req, res, next)=>{
  res.status(404).send('<h1>Page not found.</h1>');
})
/* 
  ! 404 handler middleware will be executed when a request come to an unidentified route
*/
app.listen(3000);
