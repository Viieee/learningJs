const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
  const editMode = req.query.edit;
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    // formsCSS: true,
    // productCSS: true,
    // activeAddProduct: true
    editing: editMode
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  const product = new Product(null, title, imageUrl, description, price); // the first argument is null, because we want to add new product and therefore don't have an id yet for that product
  product.save();
  res.redirect('/');
};

// getting product to edit
exports.getEditProduct = (req, res, next) => {
    // checking query params (extra data on the url)
  const editMode = req.query.edit;
  if(!editMode){
    res.redirect('/')
  }
  const prodId = req.params.productId;
  Product.findById(prodId, product=>{
    if(!product){
      return res.redirect('/')
    }
    res.render('admin/edit-product', {
      pageTitle: 'Edit Product',
      path: '/admin/edit-product',
      // formsCSS: true,
      // productCSS: true,
      // activeAddProduct: true,
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


exports.getProducts = (req, res, next) => {
  Product.fetchAll(products => {
    res.render('admin/products', {
      prods: products,
      pageTitle: 'Admin Products',
      path: '/admin/products'
    });
  });
};


// deleting product
exports.postDeleteProduct = (req, res, next) =>{
  const prodId = req.body.productId;
  Product.deleteById(prodId);
  res.redirect('/admin/products')
}