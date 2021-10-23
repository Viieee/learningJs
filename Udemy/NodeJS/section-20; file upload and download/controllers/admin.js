const Product = require("../models/product");

const expressValidator = require("express-validator");

exports.getProducts = (req, res, next) => {
  // ! we want to fetched products created only by the user, so one user can't delete/edit other user's products

  Product.find({ userId: req.user._id }) // filtering the product only made by the user
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
      // handling error using error handler middleware
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error); 
      // ! if we returning next and passing an error as an argument, we are letting express know that an error occured and it will move to the error handling middleware
    });
};

exports.getAddProduct = (req, res, next) => {
  const error = expressValidator.validationResult(req);
  let message = error.array();

  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }

  // sending response
  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    editing: false,
    hasError: false,
    errorMessage: message,
    validationError: errors.array(),
  });
};

exports.postAddProduct = (req, res, next) => {
  // fetching the data sent from request form
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const description = req.body.description;
  const price = req.body.price;

  const errors = expressValidator.validationResult(req);

  if (!errors.isEmpty()) {
    // sending response
    return res.render("admin/edit-product", {
      pageTitle: "Add Product",
      path: "/admin/add-product",
      editing: false,
      hasError: true,
      errorMessage: errors.array()[0].msg,
      product: {
        title: title,
        imageUrl: imageUrl,
        description: description,
        price: price,
      },
      validationError: errors.array(),
    });
  }

  const product = new Product({
    title: title,
    imageUrl: imageUrl,
    description: description,
    price: price,
    userId: req.session.user._id,
  });

  product
    .save() // ! provided by mongoose
    .then((result) => {
      res.redirect("/admin/products");
    })
    .catch((err) => {
      // handling error using error handler middleware
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error); 
      // ! if we returning next and passing an error as an argument, we are letting express know that an error occured and it will move to the error handling middleware
    });
};

exports.getEditProduct = (req, res, next) => {
  // checking query params (extra data in url)
  const editMode = req.query.edit;
  if (!editMode) {
    res.redirect("/");
  }

  const error = expressValidator.validationResult(req);
  let message = error.array();

  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
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
        hasError: false,
        errorMessage: message,
        validationError: errors.array(),
      });
    })
    .catch((err) => {
      // handling error using error handler middleware
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error); 
      // ! if we returning next and passing an error as an argument, we are letting express know that an error occured and it will move to the error handling middleware
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

  const errors = expressValidator.validationResult(req);

  if (!errors.isEmpty()) {
    // theres an error
    return res.render("admin/edit-product", {
      pageTitle: "Edit Product",
      path: "/admin/edit-product",
      editing: true,
      product: {
        title: updatedTitle,
        imageUrl: updatedImageUrl,
        price: updatedPrice,
        description: updatedDescription,
        _id: prodId,
      },
      hasError: true,
      errorMessage: errors.array()[0].msg,
      validationError: errors.array(),
    });
  }

  Product.findById(prodId)
    // ! findById() is provided by mongoose, in mongoose it fetches the document with the id passed onto the argument
    .then((product) => {
      if (product.userId.toString() !== req.user._id.toString()) {
        // authorization
        return res.redirect("/");
      }
      // ! it returns an object
      // updating the value
      product.title = updatedTitle;
      product.imageUrl = updatedImageUrl;
      product.price = updatedPrice;
      product.description = updatedDescription;

      // saving the changes
      return product.save().then((result) => {
        console.log("updated!");
        res.redirect("/admin/products");
      });
    })
    .catch((err) => {
      // handling error using error handler middleware
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error); 
      // ! if we returning next and passing an error as an argument, we are letting express know that an error occured and it will move to the error handling middleware
    });
};

exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  Product.deleteOne({ _id: prodId, userId: req.user._id })
    // ! deleteOne() is a method provided by mongoose, we can filter it for authorization
    .then((result) => {
      console.log("deletion succeded!");
      res.redirect("/admin/products");
    })
    .catch((err) => {
      // handling error using error handler middleware
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error); 
      // ! if we returning next and passing an error as an argument, we are letting express know that an error occured and it will move to the error handling middleware
    });
};
