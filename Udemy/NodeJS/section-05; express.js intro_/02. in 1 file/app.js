// core modules
//// const http = require("http");

// 3rd party packages
const express = require("express");
const bodyParser = require("body-parser")

// initializing express object
const app = express();
/* 
    ? express package is returning a function,
    ? a function that if being called will initialize an express object,
    ? the object will store a lot of express logic,
    ! in our current case, the app constant will be the object
*/

/* 
    ! this middleware will run no matter what
    ? extended: true use qs library
    ? extended: false use querystring library
    difference:

    querystring cannot parse nested object.
    Instead, it will be presented in [] format.
    While qs can be parsed in nested object.
*/
// parsing the body
app.use(bodyParser.urlencoded({extended:true}))


/* 
    ? this middleware will execute when the user visit the link with '/add-product' after the domain
    example:
    http://localhost:3000/add-product/
    or
    http://localhost:3000/add-product/asfdafd

    ! this happens because we use the use() method to route
*/

app.use("/add-product", (req, res, next) => {
  // sending response
  res.send(
    '<h1>Add product page</h1> <form action="/product" method="POST"><input type="text" name="title"><button type="submit">Add Product</button></form>'
  );
});

app.post("/product", (req, res, next) => {
    // extracting the data sent by user
    // ! by default, request doesn't try to parse the incoming request body. We need parser to parse it
    console.log(req.body);
    res.redirect('/')
});

/* 
    ? this middleware will execute when the user visit the link with '/' after the domain
    example:
    http://localhost:3000/
    or
    http://localhost:3000/afdfadfasfasfsd

    ! this happens because we use the use() method to route
*/
app.use("/", (req, res, next) => {
  // sending response
  res.send("<h1>Hello from express</h1>");
});

/*
 //// const server = http.createServer(app);
 //// server.listen(3000); 
*/

app.listen(3000);
