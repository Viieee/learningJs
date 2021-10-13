const Product = require("../models/product");

exports.getAddProduct = (req, res, next) => {
  // sending response
  res.render("admin/add-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
  });
};

exports.postAddProduct = (req, res, next) => {
  // fetching the data sent from request form
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const description = req.body.description;
  const price = req.body.price;

  // storing the data into products array
  // ! instantiating the product class
  const product = new Product(title, imageUrl, description, price); 
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
    res.render("admin/products", {
      pageTitle: "Admin Products",
      path: "/admin/products",
      prods: products,
    });
  });
};
