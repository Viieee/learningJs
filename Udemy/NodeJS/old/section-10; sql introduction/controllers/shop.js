// importing the product model
const Product = require('../models/product');

// exporting getProducts method
// this method will execute when we accessing /products url
// the main purpose of this method is to fetch all data in product table
  // and passing all the data into the ejs file
exports.getProducts = (req, res, next) => {
  // findAll is a default method provided by sequelize
  // it will fetched all data in the Product table
  // the data fetched will be passed into then method
  Product.findAll()
    .then(products => {
      // product in the parameter is the value passed from findAll method
      // it contains all the products in the product table
        // in form of an array
      // after we fetched all the data
      // we render the ejs file views/shop/product-list
      res.render('shop/product-list', {
        // this is all the data we will passed onto the ejs file
          // so the ejs file can use dynamic data
        prods: products, // products are an array of product objects 
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
  Product.findByPk(prodId)
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

// exporting the getIndex method 
// this method will execute when we accessing the default url /
// we want to fetch all the data in product database and passing it into the ejs file
exports.getIndex = (req, res, next) => {
  Product.findAll()
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

// exporting the getCart method
// this method will execute when we accessing the /cart url
// the main purpose of this method is to fetch all products in the cart of user
// this method is based on each user
exports.getCart = (req, res, next) => {
  // we're using req.user because with it we can access all data related to user

  // getting the cart of user
  req.user
    .getCart()
    .then(cart => {
      // then we getting all the products in the cart
      console.log(cart)
      return cart
        .getProducts()
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
    })
    .catch(err => console.log(err));
};

// exporting the postCart method
// this method will execute when we adding a product to the cart
exports.postCart = (req, res, next) => {
  // fetching product id from hidden input tag in the ejs file
  const prodId = req.body.productId;
  // later will store user's cart, so we can use it anywhere else in this method
  let fetchedCart;
  // the default quantity, for freshly added product
  let newQuantity = 1;
  // getting user's cart
  req.user
    .getCart()
    .then(cart => {
      // then storing the cart into fetchedCart
      fetchedCart = cart;
      // getting the product with the same id as prodId
      // this process is to see whether the item that we just added
        // already exist on the cart or not
        // if yes then it will returned an array with only the product being the value in it
        // if no then it will return undefined
      // then returning it so we can deal with it 
      // on the next then method
      return cart.getProducts({ where: { id: prodId } });
    })
    .then(products => { 
      // products is the product fetched in previous then method

      // product will store the product later
      // because even though we will only fetching 1 data from the previous then method
        // it still returning an array
      // so this variable will store the value indexed 0
      let product;
      if (products.length > 0) {
        product = products[0];
      }

      // if product already exist in the cart,  the product varible will contain the product object (truthy)
      // if product isn't in the cart yet, the product variable will contain undefined (falsy)

      if (product) {
        // if product contain truthy value
        // this will execute

        // extracting the old quantity of the product
        const oldQuantity = product.cartItem.quantity;
        // adding the old quantity and storing it to newQuantity
        newQuantity = oldQuantity + 1;
        // returning the product so we can deal with it later in the next then method
        return product;
      }

      // if the product variable contain falsy value
      // then we returning a product from products table with the same id as prodId
      // so we can deal with it later in the next then method
      return Product.findByPk(prodId);
    })
    .then(product => {
      // we adding a new product into our cart 
      // but later it won't be stored in the cart table but in the intermediary table
        // which is cartItem table
      // because cartItem table has more attribute than cart (in this case quantity attribute)
      return fetchedCart.addProduct(product, {
        through: { quantity: newQuantity } // passing data into the extra attribute of the intermediary table
                                          // using through key
      });
    })
    .then(() => {
      // after all previous then methods is done
      // we redirect to cart page
      res.redirect('/cart');
    })
    .catch(err => console.log(err));
};

// exporting the postCartDeleteProduct
// this method will execute when we are deleting a product in cart
exports.postCartDeleteProduct = (req, res, next) => {
  // getting the product's id from the hidden input tag in the ejs file
  const prodId = req.body.productId;
  // getting user's cart
  req.user
    .getCart()
    .then(cart => {
      // then getting the product in cart
      // because the relation between product and cart are many to many,
        // we're using getProducts which will get all the products in cart
        // but we will later filter it by adding argument to it 
        // in form of an object where the id is the same as the prodId
      // this operation will return a product with the same id as the prodId
        // in the form of an array still
      // then we will return the value so we can deal with it later in the next then method
      return cart.getProducts({ where: { id: prodId } });
    })
    .then(products => {
      //  products is an array that contain only the product we're looking for
      // because we have filtered it in the previous then method
      // but its still an array so we need to redistribute the first and only value
        // of the array 
      const product = products[0];
      // then we use destroy to delete the item from cart
      // product.cartItem is used here because our intention in this then method is to delete the product inside of the cart
        // and because product and cart have many to many relationship, we're using an intermediary table (in this case it's called cartItem)
        // thats why in order to delete the table from cart we need to access the product we want to delete in the intermediary table
      // this line of code means => we want to return the product we've filtered on the cartItem table
      return product.cartItem.destroy();
    })
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
    .getCart()
    .then(cart => {
      // storing the cart we get from getCart to fetchedCart so we can reuse it later
      fetchedCart = cart;
      // getting all the products in the cart
      return cart.getProducts();
    })
    .then(products => {
      // after we getting all the products in the cart
      // were making an order in the name of the user
      // it will return an order
      return req.user
        .createOrder()
        .then(order => {
          // we're gonna add all the products we get from the cart to order
          return order.addProducts(
            // mapping  all the value in the products array
              // and executing a callback funtion to each value inside of the array
            products.map(product => {
              // to each product
              product.orderItem = { quantity: product.cartItem.quantity }; // adding extra data into intermediary table between order and product
                                                                           // we adding product's quantity on cart and that quantity is stored in other intermeidary table in cartItem table 
              return product; // retuning the product
            })
          );
        })
        .catch(err => console.log(err));
    })
    .then(result => {
      // after the products in cart successfully moved to order table
      // we removing all the products in cart
      return fetchedCart.setProducts(null);
    })
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
    .getOrders({include: ['products']}) // we including a data with a field product, became products because it has many to many relations with order
                                        // this tells sequelize 'hey if you fetching all the orders data, please also fetch all the related product data too'
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
