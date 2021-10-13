const Product = require("../models/product");

exports.getAddProduct = (req, res, next) => {
  // sending response
  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    editing: false,
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
  const product = new Product(null, title, imageUrl, description, price);
  product.save();
  res.redirect("/");
};

exports.getEditProduct = (req, res, next) => {
  // checking query params (extra data in url)
  const editMode = req.query.edit;
  if (!editMode) {
    res.redirect("/");
  }

  // extracting the product through the id
  const prodId = req.params.productId;
  // ! productId is the variable segment in the route
  Product.findById(prodId, (product) => {
    if (!product) {
      return res.redirect("/");
    }
    // sending response
    res.render("admin/edit-product", {
      pageTitle: "Edit Product",
      path: "/admin/edit-product",
      editing: editMode,
      product: product,
    });
  });
};

exports.postEditProduct = (req, res, next) => {
  // fetching the data sent from request form
  // ! this time with the product id
  const prodId = req.body.productId; // productId is the name attribute in the input tag
  const updatedTitle = req.body.title;
  const updatedImageUrl = req.body.imageUrl;
  const updatedPrice = req.body.price;
  const updatedDescription = req.body.description;
  // create new product instance
  const updatedProd = new Product(
    prodId,
    updatedTitle,
    updatedImageUrl,
    updatedDescription,
    updatedPrice
  );
  // saving the updatedProd object
  updatedProd.save();
  res.redirect("/admin/products");
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

exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  Product.deleteById(prodId);
  res.redirect("/admin/products");
};
