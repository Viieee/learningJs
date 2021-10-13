// importing the product model
const Product = require('../models/product');


// exporting the getIndex method 
// this method will execute when we accessing the default url /
// we want to fetch all the data in product database and passing it into the ejs file
exports.getIndex = (req, res, next) => {
  Product.fetchAll()
    .then(products => {
      res.render('shop/index', {
        prods: products, // its an array
        pageTitle: 'Shop',
        path: '/'
      });
    })
    .catch(err => {
      console.log(err);
    });
};


// exporting getProducts method
// this method will execute when we accessing /products url
// the main purpose of this method is to fetch all data in product table
  // and passing all the data into the ejs file
exports.getProducts = (req, res, next) => {
  Product.fetchAll()
    .then(products => {
      res.render('shop/product-list', {
        prods: products,
        pageTitle: 'All Products',
        path: '/products'
      });
    })
    .catch(err => {
      console.log(err);
    });
};

// exporting getProduct method
// this method will execute when we accessing /products/:productId url
// the main purpose of this method is to fetch detailed information on one product
exports.getProduct = (req, res, next) => {
  // fetching the product's id
    // the id is passed on to this method through url in href attribute in 'a' tag
  const prodId = req.params.productId;

  // searching the product with the id of prodId
  // the returned value will be passed onto the then method
  Product.findById(prodId)
    .then(product => {
      // after we found the product by id 
      // we passing in the returned value into the ejs file
      res.render('shop/product-detail', {
        product: product, // its an object
        pageTitle: product.title,
        path: '/products'
      });
    })
    .catch(err => console.log(err));
};

// exporting the getCart method
// this method will execute when we accessing the /cart url
// the main purpose of this method is to fetch all products in the cart of user
// this method is based on each user
exports.getCart = (req, res, next) => {
  // we're using req.user because with it we can access all data related to user

  // getting the cart of user
  req.user
    .getCart()
    .then(
      // then we render all the products in the cart and passing the products data into the ejs file
      products => {
      res.render('shop/cart', {
        path: '/cart',
        pageTitle: 'Your Cart',
        products: products // its an array of product objects
      });
    })
    .catch(err => console.log(err));
};

// exporting the postCart method
// this method will execute when we adding a product to the cart
exports.postCart = (req, res, next) => {
  // fetching product id from hidden input tag in the ejs file
  const prodId = req.body.productId;

  Product.findById(prodId)
  .then(product=>{
    return req.user.addToCart(product);
  })
  .then(result=>{
    console.log(result)
    res.redirect('/cart')
  })
  .catch(err=>{
    console.log(err)
  })
};

// exporting the postCartDeleteProduct
// this method will execute when we are deleting a product in cart
exports.postCartDeleteProduct = (req, res, next) => {
  // getting the product's id from the hidden input tag in the ejs file
  const prodId = req.body.productId;
  // getting user's cart
  req.user
    .deleteItemFromCart(prodId)
    .then(result => {
      // after all the operations in the previous then methods is done
      // we redirecting to cart page
      res.redirect('/cart');
    })
    .catch(err => console.log(err));
};

// exporting the postOrder method
// this method will trigger when we want to move items from cart to order
exports.postOrder = (req, res, next) => {
  // fetchedCart will be used to store the cart and will be reusable in the entire method
  let fetchedCart;
  // fetching the user's cart 
  req.user
    .addOrder()
    .then(result => {
      // then after all operations is done
      // we redirect to /orders
      res.redirect('/orders');
    })
    .catch(err => console.log(err));
};

exports.getOrders = (req, res, next) => {
  // getting user's order
  req.user
    .getOrders()
    .then(orders => {
      // because we including the product table in the getOrders method
      // we're getting all the data in orderItems table and product table as extra data with it
      // orders is an array
      res.render('shop/orders', {
        path: '/orders',
        pageTitle: 'Your Orders',
        orders: orders
      });
    })
    .catch(err => console.log(err));
};
