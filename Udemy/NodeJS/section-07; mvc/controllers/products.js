const Product = require("../models/product");

exports.getAddProduct = (req, res, next) => {
  // sending response
  res.render("add-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
  });
};

exports.postAddProduct = (req, res, next) => {
  // storing the data into products array
  const product = new Product(req.body.title); // ! instantiating the product class
  product.save();
  res.redirect("/");
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
    res.render("shop", {
      pageTitle: "Shop",
      path: "/",
      prods: products,
    });
  });
};
