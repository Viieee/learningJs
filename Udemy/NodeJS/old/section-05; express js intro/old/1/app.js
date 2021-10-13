const http = require('http');

// importing expressJs, this will export a function
const express = require('express');

// make an app by running the express function and store it in a variable
// it will initialize a new object where express will store and manage
// a lot of things behind the scene
const app = express();

// use() allows us to add a new middleware function
// you can pass a function into it as the argument 
// and the function argument will be executed for
// every incoming request
app.use((req, res, next) => {
    console.log('In the middleware!');
    next(); // Allows the request to continue to the next middleware in line
});

app.use((req, res, next) => {
    console.log('In another middleware!');
    
    // sending response
    // type any
    // default header is text/html
    res.send('<h1>Hello from Express!</h1>');
});

// const server = http.createServer(app);

// server.listen(3000);

app.listen(3000)