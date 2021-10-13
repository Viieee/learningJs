const Product = require("../models/product");
const Cart = require("../models/cart");

exports.getIndex = (req, res, next) => {
  Product.fetchAll((products) => {
    /* 
          !products in the parameter of this callback function will be passed on from the fetchAll method
          ? if the file exist, the parsed data inside the file will be the value of the products
          ? if the file doesn't exist, an empty array will be the value of products instead
          later on the products will be passed on to the ejs file and will be rendered to the user
        */

    //sending response
    res.render("shop/index", {
      pageTitle: "Shop",
      path: "/",
      prods: products,
    });
  });
};

exports.getProducts = (req, res, next) => {
  Product.fetchAll((products) => {
    /* 
      !products in the parameter of this callback function will be passed on from the fetchAll method
      ? if the file exist, the parsed data inside the file will be the value of the products
      ? if the file doesn't exist, an empty array will be the value of products instead
      later on the products will be passed on to the ejs file and will be rendered to the user
    */

    //sending response
    res.render("shop/product-list", {
      pageTitle: "All Products",
      path: "/products",
      prods: products,
    });
  });
};

exports.getAProduct = (req, res, next) => {
  // extracting the id of the product from dynamic variable segment
  const prodId = req.params.productId;
  // ! productId is the variable segment in the route

  Product.findById(prodId, (product) => {
    // ! filtered product we get from findById will be passed onto the ejs views
    res.render("shop/product-detail", {
      pageTitle: product.title,
      path: "/products",
      product: product,
    });
  });
};

exports.getCart = (req, res, next) => {
  /* 
    flow:
    1. getting all products in cart
        ! returning an object with products and totalPrice as the properties
        ! {"products":[{"id": ???,"qty": ???}],"totalPrice":???}
    2. getting all products available/stored in products.json
       we want to do this to extract the additional info about the products
       because the information we have about the product in cart.json 
       is pretty limited (only the id stored there)
       the fetched products will be send to the ejs file later on
        ! returning array of product objects
        ! products: [{"id":???, "title": ???, "imageUrl": ???, "description": ???, "price": ???}]
    3. loop through returned value from fetching all products 
        for every product looped, we want to check for every product in products.json
        if the product existed in the cart or not
        ! if the id of the cart's product matched the product in products.json we want to return it then store it in a variable
        ? the variable used to stored is cartProductData
    4. cartProductData will contain data if the product in cart exist in products.json
       then push data with the current instantiated product and qty of the product in cart 
       as the properties

  */

  // ! #1
  Cart.getProductsInCart((cart) => {
    // ! #2
    Product.fetchAll((products) => {

      const cartProducts = [];
      // ! #3
      for (product of products) {
        // ! this loop will execute for every value in products array
        const cartProductData = cart.products.find((prod) => {
          if (prod.id === product.id) {
            // ! it will return all the products in products.json existed in the cart
            return prod;
          }
        });

        // ! #4
        if (cartProductData) {
          cartProducts.push({
            // ! this product structure will be the structure we use in the cart.ejs file
            productData: product,
            qty: cartProductData.qty,
          });
        }

        /* 
          ? the default cart structure => {"products":[{"id": "????", qty: 0}],"totalPrice":0}
          ? cartProducts = [{"productData": [{"id":???, "title": ???, "imageUrl": ???, "description": ???, "price": ???}], "qty": ???}]
          so we want to give some additional information for the products in the cart, like the title, image url, desc, and price.
        */
      }

      //sending response
      res.render("shop/cart", {
        pageTitle: "Your Cart",
        path: "/cart",
        cartProducts: cartProducts
      });
    });
  });
};

exports.postCart = (req, res, next) => {
  // retrieving the product id from request
  const prodId = req.body.productId;
  // ! productId is the name we use in the hidden input in product-detail.ejs

  // finding the product based on its id
  Product.findById(prodId, (product) => {
    Cart.addProduct(prodId, product.price);
  });
  console.log(prodId);
  res.redirect("/cart");
};

exports.postCartDelete = (req, res, next)=>{
  const prodId = req.body.productId;
  // finding the product price, because we need it to delete the product from cart
  Product.findById(prodId, product=>{
    Cart.deleteProduct(prodId, product.price)
    res.redirect('/cart')
  })
}

exports.getCheckout = (req, res, next) => {
  //sending response
  res.render("shop/checkout", {
    pageTitle: "Checkout",
    path: "/checkout",
  });
};

exports.getOrders = (req, res, next) => {
  //sending response
  res.render("shop/orders", {
    pageTitle: "Your Orders",
    path: "/orders",
  });
};
