const Product = require('../models/product');

exports.getProducts = (req, res, next) => {
  // getting all the records using sequelize 
  Product.findAll()
  .then(products=>{
    res.render('shop/product-list', {
      prods: products,
      pageTitle: 'All Products',
      path: '/products'
    });
  })
  .catch(err=>{
    console.log(err);
  })
};

// getting the details of one product
exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId; // productId is the url path name in router
  Product.findByPk(prodId) // findByPk is replacing findById in sequelize
  .then((product) => {
    res.render('shop/product-detail', {
      product: product,
      pageTitle: product.title,
      path: '/products'
    })
  })
  .catch(err=>{
    console.log(err)
  })

  // we can also use findAll() method and setting some restriction in it (using where syntax)
};

// getting all the data in index html page
exports.getIndex = (req, res, next) => {
  // getting all the records using sequelize 
  Product.findAll()
  .then(products=>{
    res.render('shop/index', {
      // additional data to be dynamically used in the ejs files
      prods: products,
      pageTitle: 'Shop',
      path: '/'
    });
  })
  .catch(err=>{
    console.log(err);
  })
};

exports.getCart = (req, res, next) => {
    // Cart.getProductsInCart(cart=>{ // getting all items in cart
  //   Product.fetchAll(products=>{ // fetching all products we have (not just in the cart)
  //     // the array that will hold all the products in cart
  //     const cartProducts = [];
  //     // looping every item we have, to check if its in the cart or not
  //     for(product of products){ // product represents every single item in products array

  //       // check if the item we iterating right now is in the cart or not
  //       // cart.products is the key value containing all the products data in the form of an array
  //         // we want to return all the values that fulfilled the criteria
  //         // we will store it in a constant
  //       const cartProductData = cart.products.find(prod=>prod.id===product.id);
  //       console.log('cart product data: '+ cartProductData)
  //       if(cartProductData){
  //         cartProducts.push({
  //           productData: product,
  //           qty: cartProductData.qty
  //         })
  //       }
  //     }
      // res.render('shop/cart', {
      //   // additional data we want to send to our view
      //   path: '/cart',
      //   pageTitle: 'Your Cart',
      //   products: cartProducts
      // });
  //   });
  // });

  req.user.getCart()
  .then(cart=>{
    return cart.getProducts()
    .then(products => {
      res.render('shop/cart', {
        // additional data we want to send to our view
        path: '/cart',
        pageTitle: 'Your Cart',
        products: products
      });
    })
    .catch(err=>{
      console.log(err)
    });
  })
  .catch(err=>{
    console.log(err)
  })
};

// adding products to the cart
exports.postCart = (req, res, next) => {
  const prodId = req.body.productId; // product id is the name attribute in the input tag
  let fetchedCart;
  let newQuantity = 1;
  req.user.getCart()
  .then(cart=>{
    fetchedCart = cart;
    return cart.getProducts({where:{id:prodId}})
  })
  .then(products =>{
    let product;
    if(products.length>0){
      product = products[0]
    }
  
    if(product){
      // if we already have the product in the cart
      const oldQuantity = product.cartItem.quantity;
      newQuantity = oldQuantity+1;
    
      return product;
    }
    return Product.findByPk(prodId)
  })
  .then(product=>{
    return fetchedCart.addProduct(product, { through: {quantity: newQuantity} });
  })
  .then(()=>{
    res.redirect('/cart')
  })
  .catch(err=>{
    console.log(err)
  })
}

exports.postCartDelete = (req, res, next)=>{
  const prodId = req.body.productId;
  req.user.getCart()
  .then(cart=>{
    return cart.getProducts({where:{id: prodId}})
  })
  .then(products=>{
    const product = products[0];
    return product.cartItem.destroy() // remove it from inbetween table
  })
  .then(()=>{
    res.redirect('/cart')
    
  })
  .catch(err=>{
    console.log(err)
  })
}

exports.getOrders = (req, res, next) => {
  req.user.getOrders({include: ['products']}) // associate
  .then(orders => {
    res.render('shop/orders', {
      path: '/orders',
      pageTitle: 'Your Orders',
      orders: orders
    });
  })
  .catch(err=>{
    console.log(err)
  })
  
};

exports.postOrder = (req, res, next) =>{
  let fetchedCart;
  // take all items in cart and move them to an order
  req.user.getCart()
  .then(cart=>{
    fetchedCart = cart;
    return cart.getProducts();
  })
  .then(products => {
    return req.user
            .createOrder()
            .then(order=>{
               return order.addProducts(products.map(product => {
                // for every product
                product.orderItem = { // the name of the defined model
                  // value for the inbetween table
                  quantity: product.cartItem.quantity
                } 
                return product;
              }))
            })
            .catch(err=>{
              console.log(err)
            });
  })
  .then(result => {
    // deleting all items in cart after we click order button
    return fetchedCart.setProducts(null);
  })
  .then(result=>{
    res.redirect('/orders');
  })
  .catch(err=>{
    console.log(err)
  })
}


