const Product = require('../models/product');

// function that will execute when we visit /admin/add-product
exports.getAddProduct = (req, res, next) => {
  // rendering the ejs file with additional data in object (second argument)
  res.render('admin/add-product', {
    // additional data to be dynamically used in the ejs files
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    formsCSS: true,
    productCSS: true,
    activeAddProduct: true
  });
};

exports.postAddProduct = (req, res, next) => {
  // extracting the data from request body
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;

  // saving the data into a file
  const product = new Product(title, imageUrl, description, price);
  product.save();
  res.redirect('/');
};

exports.getProducts = (req, res, next) => {
  Product.fetchAll(products => { // the products parameter is passed on from the getProductsFromFile
                                // it's either an empty array if the file doesn't exist yet
                                // or it will passed in all the parsed data in form of an array
    res.render('admin/products', {
      prods: products,
      pageTitle: 'Admin Products',
      path: '/admin/products'
    });
  });
};
