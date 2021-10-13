const Product = require("../models/product");
const Cart = require("../models/cart");

exports.getIndex = (req, res, next) => {
  Product.fetchAll()
    .then(([rows, metadata]) => {
      /* 
      ? it will return an array
      ? the first index/[0] is the data fetched from the database (it will be represented by rows in the parameter)
      ? the second index/[1] is the metadata
    */
      res.render("shop/index", {
        prods: rows,
        pageTitle: "Shop",
        path: "/",
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getProducts = (req, res, next) => {
  Product.fetchAll()
    .then(([rows, metadata]) => {
      /* 
      ? it will return an array
      ? the first index/[0] is the data fetched from the database (it will be represented by rows in the parameter)
      ? the second index/[1] is the metadata
    */
      res.render("shop/product-list", {
        pageTitle: "All Products",
        path: "/products",
        prods: rows,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getAProduct = (req, res, next) => {
  const prodId = req.params.productId;

  Product.findById(prodId)
    .then(([product, metadata]) => {
      /* 
      ? it will return an array
      ? the first index/[0] is the data fetched from the database (it will be represented by product in the parameter)
      ? the second index/[1] is the metadata
      */
      res.render("shop/product-detail", {
        pageTitle: product[0].title,
        path: "/products",
        product: product[0],
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getCart = (req, res, next) => {
  Cart.getProductsInCart((cart) => {
    Product.fetchAll((products) => {
      const cartProducts = [];

      for (product of products) {
        const cartProductData = cart.products.find((prod) => {
          if (prod.id === product.id) {
            return prod;
          }
        });

        if (cartProductData) {
          cartProducts.push({
            productData: product,
            qty: cartProductData.qty,
          });
        }
      }

      res.render("shop/cart", {
        pageTitle: "Your Cart",
        path: "/cart",
        cartProducts: cartProducts,
      });
    });
  });
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;

  Product.findById(prodId, (product) => {
    Cart.addProduct(prodId, product.price);
  });
  console.log(prodId);
  res.redirect("/cart");
};

exports.postCartDelete = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId, (product) => {
    Cart.deleteProduct(prodId, product.price);
    res.redirect("/cart");
  });
};

exports.getCheckout = (req, res, next) => {
  res.render("shop/checkout", {
    pageTitle: "Checkout",
    path: "/checkout",
  });
};

exports.getOrders = (req, res, next) => {
  res.render("shop/orders", {
    pageTitle: "Your Orders",
    path: "/orders",
  });
};
