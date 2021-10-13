const Product = require('../models/product');

// getting all the products in admin products page
exports.getProducts = (req, res, next) => {
  Product.find()
    // .select('title price -_id) // telling mongoose we only want the title and price fields and excluding the id
    // .populate('userId', 'name') // populating certain field with all the detail information and not just the id, we only want the name
    .then(products => {
      res.render('admin/products', {
        prods: products,
        pageTitle: 'Admin Products',
        path: '/admin/products'
      });
    })
    .catch(err => console.log(err));
};

// go to the add page form
exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false
  });
};

// sending the data into the database
exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  // making an object from the schema we defined in the product model
  const product = new Product({
    title: title, 
    price: price,
    description: description,
    imageUrl: imageUrl,
    userId: req.user._id
  })
  // calling save method provided by mongoose
  product.save()
  .then(result=>{
    // result is the value returned from save method
    console.log('product created!')
    res.redirect('/admin/products')
  })
  .catch(err=>{
    console.log(err)
  })
};

// getting the data of the product we want to edit
exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect('/');
  }
  // getting the product's id through url
  const prodId = req.params.productId;
  // finding the product we want to edit by id
  Product.findById(prodId)
    .then(product => {
      if (!product) {
        return res.redirect('/');
      }
      res.render('admin/edit-product', {
        pageTitle: 'Edit Product',
        path: '/admin/edit-product',
        editing: editMode,
        product: product
      });
    })
    .catch(err => console.log(err));
};

// sending the edited product back to the database
exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedImageUrl = req.body.imageUrl;
  const updatedDesc = req.body.description;

  // fetching the product we want to edit
  Product.findById(prodId)
  .then(product=>{
    // we getting back the product with the id of prodId
    // now we can alter the value of the product with the data we fetched from the fields
    product.title = updatedTitle
    product.price = updatedPrice
    product.description = updatedDesc
    product.imageUrl = updatedImageUrl

    // then we save the edit
    product.save()
  })
  .then(result => {
    console.log('UPDATED PRODUCT!');
    res.redirect('/admin/products');
  })
  .catch(err=>{
    console.log(err)
  })
};


// deleting product
exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  // findByIdAndRemove is method provided by mongoose
  Product.findByIdAndRemove(prodId)
    .then(result => {
      res.redirect('/admin/products');
    })
    .catch(err => console.log(err));
};
