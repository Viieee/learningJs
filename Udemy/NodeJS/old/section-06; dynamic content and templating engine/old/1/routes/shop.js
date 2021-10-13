const path = require('path');

const express = require('express');

const rootDir = require('../util/path');
const adminData = require('./admin')

const router = express.Router();

router.get('/', (req, res, next) => {
  // console.log('shop.js ',adminData.products);
  // res.sendFile(path.join(rootDir, 'views', 'shop.html'));

  const products = adminData.products;

  // rendering the page with the default templating engine we defined in the app.js file (view engine)
  res.render('shop', 
  {
    // injecting data into templating engine
    prods: products,
    docTitle: 'Shop'
  })
});

module.exports = router;
