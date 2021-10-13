const Product = require('../models/product');

// function that will execute when we visit /admin/add-product
exports.getAddProduct = (req, res, next) => {
  const editMode = req.query.edit;
  // rendering the ejs file
  // first parameter is the path to the ejs file
  // second data is the additional data to be dynamically used in the ejs files
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: editMode
  });
};

// getting all the products
exports.getProducts = (req, res, next) => {
  Product.fetchAll(products => { // the products parameter is passed on from the getProductsFromFile
                                // it's either an empty array if the file doesn't exist yet
                                // or it will passed in all the parsed data in form of an array
    // rendering the ejs file
    // first parameter is the path to the ejs file
    // second data is the additional data to be dynamically used in the ejs files
    res.render('admin/products', {
      // additional data to be dynamically used in the ejs files
      prods: products,
      pageTitle: 'Admin Products',
      path: '/admin/products'
    });
  });
};

// adding product
exports.postAddProduct = (req, res, next) => {
  // extracting the data from request body
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;

  // making an object from input fields
  const product = new Product(null, title, imageUrl, description, price); // the first argument is null, because we want to add new product and therefore don't have an id yet for that product
  // saving the data into a file
  product.save()
  .then(()=>{
    res.redirect('/');
  })
  .catch(err=>{
    console.log(err)
  });
};

// getting product to edit
exports.getEditProduct = (req, res, next) => {
    // checking query params (extra data on the url)
  const editMode = req.query.edit;
  // if the edit params dont contain true 
  // we will be redirected 
  if(!editMode){
    res.redirect('/')
  }
  // productId is the name attribute from hidden value we stored in url
  const prodId = req.params.productId;
  // finding the product by id
  // product parameter in the callback function (second argument)
  // is the value of filtered product that has the same if as the id we just recieve from 
    // hidden input tag in ejs file
  Product.findById(prodId, product=>{
    // if the product doesn't exist, we will be redirected
    if(!product){
      return res.redirect('/')
    }
    // rendering the ejs file
    // first parameter is the path to the ejs file
    // second data is the additional data to be dynamically used in the ejs files
    res.render('admin/edit-product', {
      pageTitle: 'Edit Product',
      path: '/admin/edit-product',
      editing: editMode,
      product: product
    });
  })
};

// posting the edited data
exports.postEditProduct = (req, res, next) =>{
  // fetch information for the product
    // the id retrieved from hidden input tag
  const prodId = req.body.productId; // productId is the name attribute in the input tag
  const updatedTitle = req.body.title;
  const updatedImageUrl = req.body.imageUrl;
  const updatedPrice = req.body.price;
  const updatedDescription = req.body.description;
  // create new product instance
  const updatedProd = new Product (prodId, updatedTitle, updatedImageUrl, updatedDescription, updatedPrice);
  // save
  updatedProd.save();
  res.redirect('/admin/products')
}

// deleting product
exports.postDeleteProduct = (req, res, next) =>{
  // the id retrieved from hidden input tag
  const prodId = req.body.productId; // productId is the name attribute in the input tag
  // deleting the product based on the id
  Product.deleteById(prodId);
  res.redirect('/admin/products')
}