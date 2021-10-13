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
      });
    })
    .catch((err) => {
      console.log(err);
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
      console.log(err);
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
      console.log(err);
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
      console.log(err);
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
      console.log(err);
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
          name: req.user.name,
          userId: req.user._id,
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
      console.log(err);
    });
};

exports.getOrders = (req, res, next) => {
  // getting user's order
  Order
    .find({'user.userId': req.user._id}) // ! we want to fetched all order that have userId the same as our current user's id
    .then(orders => {
      // because we including the product table in the getOrders method
      // we're getting all the data in orderItems table and product table as extra data with it
      // ! orders is an array
      res.render('shop/orders', {
        path: '/orders',
        pageTitle: 'Your Orders',
        orders: orders
      });
    })
    .catch(err => console.log(err));
};
