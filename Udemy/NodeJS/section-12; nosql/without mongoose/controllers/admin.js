const Product = require("../models/product");

exports.getProducts = (req, res, next) => {
  /* 
   ! getProducts is a 'special method' created by sequelize from the association between users and products
   ? the reason we use this is because we want to fetched the products that belongs to the current user only
   ! getProducts returns an array 
   */
  Product.fetchAll()
    .then((products) => {
      res.render("admin/products", {
        pageTitle: "Admin Products",
        path: "/admin/products",
        prods: products,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

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

  const product = new Product(
    title,
    price,
    imageUrl,
    description,
    null,
    req.user._id
  );
  product
    .save()
    .then((result) => {
      res.redirect("/admin/products");
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getEditProduct = (req, res, next) => {
  // checking query params (extra data in url)
  const editMode = req.query.edit;
  if (!editMode) {
    res.redirect("/");
  }

  // extracting the product through the id
  const prodId = req.params.productId;

  Product.findById(prodId)
    .then((product) => {
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
    })
    .catch((err) => {
      console.log(err);
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

  const updatedProduct = new Product(
    updatedTitle,
    updatedPrice,
    updatedImageUrl,
    updatedDescription,
    prodId
  );

  updatedProduct
    .save()
    .then((result) => {
      console.log("updated!");
      res.redirect("/admin/products");
    })
    .catch((err) => {
      console.log(err);
      res.redirect("/admin/products");
    });
};

exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  Product.deleteById(prodId)
    .then((result) => {
      console.log("deletion succeded!");
      res.redirect("/admin/products");
    })
    .catch((err) => {
      console.log(err);
    });
};
