const fs = require("fs");
const path = require("path");

const Product = require("../models/product");
const Order = require("../models/order");
const product = require("../models/product");

exports.getIndex = (req, res, next) => {
  Product.find()
    // ! find() is provided by mongoose, in mongoose it fetches all documents in the table
    .then((products) => {
      // ! returns it as an array
      res.render("shop/index", {
        prods: products,
        pageTitle: "Shop",
        path: "/",
        // csrfToken: req.csrfToken(), // ! csrfToken() will generate csrf token
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

exports.getProducts = (req, res, next) => {
  Product.find()
    // ! find() is provided by mongoose, in mongoose it fetches all documents in the table
    .then((products) => {
      // ! returns it as an array
      res.render("shop/product-list", {
        pageTitle: "All Products",
        path: "/products",
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

exports.getAProduct = (req, res, next) => {
  const prodId = req.params.productId;

  Product.findById(prodId)
    // ! findById() is provided by mongoose, in mongoose it fetches the document with the id passed onto the argument
    .then((product) => {
      // ! it returns an object
      res.render("shop/product-detail", {
        pageTitle: product.title,
        path: "/products",
        product: product,
      });
    })
    .catch((error) => {
      console.log(error);
    });
};

exports.getCart = (req, res, next) => {
  req.user
    .populate("cart.items.productId") // ! telling mongoose to populate the product inside items in cart (nested document)
    .then((user) => {
      /* 
        user.cart => {items: [{productId: {.....productData}, quantity:???}]}
      */
      // ! we get back the user data with the product populated inside cart items
      const cartProducts = user.cart.items;
      res.render("shop/cart", {
        path: "/cart",
        pageTitle: "Your Cart",
        products: cartProducts,
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

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId)
    .then((product) => {
      return req.user.addToCart(product);
    })
    .then((result) => {
      res.redirect("/cart");
    })
    .catch((err) => {
      // handling error using error handler middleware
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
      // ! if we returning next and passing an error as an argument, we are letting express know that an error occured and it will move to the error handling middleware
    });
};

exports.postCartDelete = (req, res, next) => {
  const prodId = req.body.productId;
  req.user
    .deleteItemFromCart(prodId)
    .then((result) => {
      res.redirect("/cart");
    })
    .catch((err) => {
      // handling error using error handler middleware
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
      // ! if we returning next and passing an error as an argument, we are letting express know that an error occured and it will move to the error handling middleware
    });
};

exports.postOrder = (req, res, next) => {
  req.user
    .populate("cart.items.productId") // ! telling mongoose to populate the product inside items in cart (nested document)
    .then((user) => {
      /* 
        user.cart => {items: [{productId: {.....productData}, quantity:???}]}
      */
      // ! we get back the user data with the product populated inside cart items
      const products = user.cart.items.map((i) => {
        // ! transforming the value of the array because we have the data of the products nested in productId field
        // we want to extract the product data and moving it from productId field to product field
        return { quantity: i.quantity, product: { ...i.productId._doc } };
      });

      // making the order object
      const order = new Order({
        products: products,
        user: {
          email: req.session.user.email,
          userId: req.session.user._id,
        },
      });

      // saving the order
      return order.save();
    })
    .then((result) => {
      return req.user.clearCart();
    })
    .then((result) => {
      res.redirect("/orders");
    })
    .catch((err) => {
      // handling error using error handler middleware
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
      // ! if we returning next and passing an error as an argument, we are letting express know that an error occured and it will move to the error handling middleware
    });
};

exports.getOrders = (req, res, next) => {
  // getting user's order
  Order.find({ "user.userId": req.session.user._id }) // ! we want to fetched all order that have userId the same as our current user's id
    .then((orders) => {
      // because we including the product table in the getOrders method
      // we're getting all the data in orderItems table and product table as extra data with it
      // ! orders is an array
      res.render("shop/orders", {
        path: "/orders",
        pageTitle: "Your Orders",
        orders: orders,
      });
    })
    .catch((err) => console.log(err));
};

exports.getInvoice = (req, res, next) => {
  const orderId = req.params.orderId;

  // extra check
  Order.findById(orderId)
    .then((order) => {
      if (!order) {
        // if the order somehow doesn't exist anymore in the database
        return next(new Error("No order found."));
      }
      if (order.user.userId.toString() !== req.user._id.toString()) {
        // if the user downloading the file isn't the same as the one ordering
        return next(new Error("Unauthorized"));
      }
      const invoiceName = "invoice-" + orderId + ".pdf"; // the name of the file
      const invoicePath = path.join("data", "invoices", invoiceName); // path to the file

      // ! using readFile
      // fs.readFile(invoicePath, (err, data) => {
      /* 
          ! readFile means node will read the entire file, store it on the memory, then return it with the response
          ! this is bad for bigger files 
         */
      //   // this function will execute once the data being read
      //   // ! data is a buffer
      //   if (err) {
      //     return next(err); // error middleware
      //   }
      //   res.setHeader("Content-Type", "application/pdf");
      //   res.setHeader(
      //     "Content-Disposition",
      //     'inline; filename="' + invoiceName + '"'
          // ? inline will let the browser open the file in new tab
          // ? attachment instead of inline will let the browser know to straight up download the file
          // ? filename will change the file name and letting you configure it
      //   );
      //   res.send(data);
      // });

      // ! using streams instead of readFile (in case we dealing with big files)
      const file = fs.createReadStream(invoicePath);
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        'inline; filename="' + invoiceName + '"'
        // ? inline will let the browser open the file in new tab
        // ? attachment instead of inline will let the browser know to straight up download the file
        // ? filename will change the file name and letting you configure it
    );
      file.pipe(res);
      // ? res is a writable steam
      // ? the data will be download the file step by step and dont have to preload it (read the entire file)
    })
    .catch((err) => {
      next(err);
    });
};
