// const products = [];
const Product = require('../models/product')

exports.getAddProduct = (req, res, next) => {
  // sending response
  res.render("add-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
  });
};

exports.postAddProduct = (req, res, next) => {
  // storing the data into products array
  // products.push({ title: req.body.title });
  const product = new Product(req.body.title); // ! instantiating the product class
  product.save();
  res.redirect("/");
};

exports.getProducts = (req, res, next) => {
  const products = Product.fetchAll();
  // sending response
  res.render("shop", {
    prods: products,
    pageTitle: "Shop",
    path: "/",
  });
};

