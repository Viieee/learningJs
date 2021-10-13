const Product = require('../models/product');
const Cart = require('../models/cart')

exports.getProducts = (req, res, next) => {
  Product.fetchAll()
  .then(([rows, fieldData])=>{
    res.render('shop/product-list', {
      prods: rows, // products
      pageTitle: 'All Products',
      path: '/products'
    });
  })
  .catch(err=>{
    console.log(err);
  });
};

// getting the details of one product
exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId; // productId is the url path name in router
  Product.findById(prodId)
  .then(([product]) => {
    res.render('shop/product-detail', {
      product: product[0],
      pageTitle: product[0].title,
      path: '/products'
    })
  })
  .catch(err=>{
    console.log(err)
  })
};

exports.getIndex = (req, res, next) => {
  Product.fetchAll()
  .then(([rows, fieldData])=>{
    // rows contain all the product
    res.render('shop/index', {
      prods: rows, // products
      pageTitle: 'Shop',
      path: '/'
    });
  })
  .catch(err=>{
    console.log(err);
  });
};

exports.getCart = (req, res, next) => {
  Cart.getProductsInCart(cart=>{ // getting all items in cart
    Product.fetchAll(products=>{ // fetching all products we have (not just in the cart)
      // the array that will hold all the products in cart
      const cartProducts = [];
      // looping every item we have, to check if its in the cart or not
      for(product of products){ // product represents every single item in products array

        // check if the item we iterating right now is in the cart or not
        // cart.products is the key value containing all the products data in the form of an array
          // we want to return all the values that fulfilled the criteria
          // we will store it in a constant
        const cartProductData = cart.products.find(prod=>prod.id===product.id);
        console.log('cart product data: '+ cartProductData)
        if(cartProductData){
          cartProducts.push({
            productData: product,
            qty: cartProductData.qty
          })
        }
      }
      res.render('shop/cart', {
        // additional data we want to send to our view
        path: '/cart',
        pageTitle: 'Your Cart',
        products: cartProducts
      });
    });
  });
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId; // product id is the name attribute in the input tag
  console.log(prodId);
  Product.findById(prodId, product =>{
    Cart.addProduct(prodId, product.price);
  })
  res.redirect('/cart')
}

exports.postCartDelete = (req, res, next)=>{
  const prodId = req.body.productId;
  // finding the product price, because we need it to delete the product from cart
  Product.findById(prodId, product=>{
    Cart.deleteProduct(prodId, product.price)
    res.redirect('/cart')
  })
}

exports.getOrders = (req, res, next) => {
  res.render('shop/orders', {
    path: '/orders',
    pageTitle: 'Your Orders'
  });
};

exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    path: '/checkout',
    pageTitle: 'Checkout'
  });
};
