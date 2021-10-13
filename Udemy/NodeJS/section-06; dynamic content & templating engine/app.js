// core modules
//// const http = require("http");
const path = require("path");

// 3rd party packages
const express = require("express");
const bodyParser = require("body-parser");

// importing files
// ! the router files is a valid middleware function
const adminData = require("./routes/admin");
const shopRoutes = require("./routes/shop");

// initializing express object
const app = express();
/* 
    ? express package is returning a function,
    ? a function that if being called will initialize an express object,
    ? the object will store a lot of express logic,
    ! in our current case, the app constant will be the object
*/

// setting the templating engine
app.set("view engine", "ejs");
app.set("views", "views");
/* 
  ? views, the directory where the template files are located. This defaults to the views directory in the application root directory.
  ? view engine, the template engine to use.
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
app.use(express.static(path.join(__dirname, "public")));
/* 
  ? the middleware above will grant user the access to the selected folder
  ? in other words serving the folder statically
  ? we can access the css file with http://localhost:3000/css/main.css
  ! serve static files such as images, CSS files, and JavaScript files
*/

// routers middleware
app.use("/admin", adminData.routes);
/* 
  ? the first argument in the use method above is a filter for the route
  ? so every single route in the adminData file will be filtered 
  ? .routes is the route function exported from admin.js

  example:
  route get /add-product -> get /admin/add-product 
*/
app.use(shopRoutes);

// 404 handler
app.use((req, res, next) => {
  res.status(404).render('404', {pageTitle: 'Page Not Found!', path:'error'});
});
/* 
  ! 404 handler middleware will be executed when a request come to an unidentified route
  we will render the 404.ejs file using render() method
  the second argument in render() method is the data we want to pass into the 404.ejs file
*/
app.listen(3000);

/* module.exports = path.dirname(require.main.filename); */
