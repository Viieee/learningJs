const Product = require("../models/product");

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

exports.getCart = (req, res, next) => {
  //sending response
  res.render("shop/cart", {
    pageTitle: "Your Cart",
    path: "/cart",
  });
};

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
