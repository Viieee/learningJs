const Product = require("../models/product");

exports.getProducts = (req, res, next) => {
  Product.find()
    // ! find() is provided by mongoose, in mongoose it fetches all documents in the table
    /* 
      ? filtering data returned by find()
      .select('title price -_id) // ! telling mongoose we only want the title and price fields and excluding the id
    */ 
    
    /* 
      ? fetching relations;
      .populate('userId') // ! populating certain field with all the detail information and not just the id
      
      ? we can also specify which fields we want to populate
      .populate('userId', 'name') // ! we only want the name 
     */
    .then((products) => {
      // ! returns it as an array
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

  const product = new Product({
    title: title,
    imageUrl: imageUrl,
    description: description,
    price: price,
    userId: req.session.user._id
  });

  product
    .save() // ! provided by mongoose
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
    // ! findById() is provided by mongoose, in mongoose it fetches the document with the id passed onto the argument
    .then((product) => {
      // ! it returns an object
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

  Product.findById(prodId)
    // ! findById() is provided by mongoose, in mongoose it fetches the document with the id passed onto the argument
    .then((product) => {
      // ! it returns an object
      // updating the value
      product.title = updatedTitle;
      product.imageUrl = updatedImageUrl;
      product.price = updatedPrice;
      product.description = updatedDescription;

      // saving the changes
      return product.save()
    })
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
  Product.findByIdAndDelete(prodId)
  // ! findByIdAndDelete() is a method provided by mongoose
    .then((result) => {
      console.log("deletion succeded!");
      res.redirect("/admin/products");
    })
    .catch((err) => {
      console.log(err);
    });
};
