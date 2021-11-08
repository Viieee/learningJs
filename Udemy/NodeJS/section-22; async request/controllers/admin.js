const Product = require("../models/product");

const expressValidator = require("express-validator");

const fileHelper = require("../util/file");

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
  // sending response
  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    editing: false,
    hasError: false,
    errorMessage: null,
    validationError: [],
  });
};

exports.postAddProduct = (req, res, next) => {
  // fetching the data sent from request form
  const title = req.body.title;
  // const imageUrl = req.body.imageUrl;
  const image = req.file; // ! we need different parser for files, multer -> npm install --save multer
  const description = req.body.description;
  const price = req.body.price;

  if (!image) {
    // ! if the image is not set / the file format is not valid
    // sending response
    return res.status(422).render("admin/edit-product", {
      pageTitle: "Add Product",
      path: "/admin/add-product",
      editing: false,
      hasError: true,
      errorMessage: "Attached file is not an image.",
      product: {
        title: title,
        description: description,
        price: price,
      },
      validationError: [],
    });
  }

  const imageUrl = image.path; // storing the path of the file to the database

  const errors = expressValidator.validationResult(req);

  if (!errors.isEmpty()) {
    // sending response
    return res.status(422).render("admin/edit-product", {
      pageTitle: "Add Product",
      path: "/admin/add-product",
      editing: false,
      hasError: true,
      errorMessage: errors.array()[0].msg,
      product: {
        title: title,
        description: description,
        imageUrl: imageUrl,
        price: price,
      },
      validationError: errors.array(),
    });
  }

  const product = new Product({
    title: title,
    description: description,
    imageUrl: imageUrl,
    price: price,
    userId: req.user,
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
      // console.log(err)
      // ! if we returning next and passing an error as an argument, we are letting express know that an error occured and it will move to the error handling middleware
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
        hasError: false,
        errorMessage: null,
        validationError: [],
      });
    })
    .catch((err) => {
      // handling error using error handler middleware
      console.log(err);
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
  // const updatedImageUrl = req.body.imageUrl;
  const updatedImage = req.file;
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
        // imageUrl: updatedImageUrl,
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
      // product.imageUrl = updatedImageUrl;
      if (updatedImage) {
        // ! the image and imageUrl (path to the image) will only be updated when theres a file picked
        fileHelper.deleteFile(product.imageUrl); // deleting the old image in the folder
        product.imageUrl = updatedImage.path;
      }
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

exports.deleteProduct = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findById(prodId)
    .then((product) => {
      if (!product) {
        return next(new Error("Product not found."));
      }
      fileHelper.deleteFile(product.imageUrl); // deleting the image in the folder related to the deleted product

      // deleting the product from the database
      return Product.deleteOne({ _id: prodId, userId: req.user._id });
    })
    .then(() => {
      console.log("deletion succeded!");
      res.status(200).json({message: "Success!"}) 
    })
    .catch((err) => {
      res.status(500).json({message: "Failed!"})
    });
};
