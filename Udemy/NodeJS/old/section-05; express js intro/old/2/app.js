const express = require('express');
const bodyParser = require('body-parser');

const app = express();

// parsing body of the request sent through a form
// parser using body-parser
// npm install --save body-parser
app.use(bodyParser.urlencoded({extended:true}));


// routing
// this will always execute as long as we dont send it
// applied to all request
app.use('/', (req, res, next) => {
  next();
});

// trigger for request that goes to 'url/add-product'
app.use('/add-product', (req, res, next) => {
  res.send('<form action="/product" method="POST"><input type="text" name="title"><button type="submit">Add Product</button></form>');
});

// trigger for request that goes to 'url/product'
// using post request because we want to limit the middleware code execution 
// into just post requests
// because the use() method will execute regardless the type of the method of the request
app.post('/product', (req,res,next) => {
  console.log(req.body);
  // redirecting
  res.redirect('/') // redirecting into 'url/'
}) 

// trigger for request that goes to 'url/'
app.use('/', (req, res, next) => {
  res.send('<h1>Hello from Express!</h1>');
});

app.listen(3000);
