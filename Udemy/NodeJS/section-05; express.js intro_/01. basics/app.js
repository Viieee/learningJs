// core modules
//// const http = require("http");

// 3rd party packages
const express = require("express");

// initializing express object
const app = express();
/* 
    ? express package is returning a function,
    ? a function that if being called will initialize an express object,
    ? the object will store a lot of express logic,
    ! in our current case, the app constant will be the object
*/

app.use((req, res, next)=>{
    console.log('In the middleware');
    next(); // ? allows the request to continue to the next middleware in line
});

app.use((req, res, next)=>{
    console.log('another middleware');
    // sending response
    res.send('<h1>Hello from express</h1>');
});

/*
 //// const server = http.createServer(app);
 //// server.listen(3000); 
*/

app.listen(3000)
