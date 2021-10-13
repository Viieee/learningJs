const Product = require("../models/product");
const Cart = require("../models/cart");

exports.getIndex = (req, res, next) => {
  Product.findAll()
    .then((products) => {
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
  Product.findAll()
    .then((products) => {
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

  Product.findByPk(prodId)
    .then((product) => {
      res.render("shop/product-detail", {
        pageTitle: product.title,
        path: "/products",
        product: product,
      });
    })
    .catch((error) => {
      console.log(error);
    });

  /*  
    ! alternative code
    Product.findAll({where: {id: prodId}})
    .then(products => {
      ! the products returned is an array
      res.render("shop/product-detail", {
        pageTitle: products[0].title,
        path: "/products",
        product: products[0],
      });
    })
    .catch(err=>{
      console.log(err)
    }) 
    */
};

exports.getCart = (req, res, next) => {
  /* 
    ! in this method we want to render the items on the cart associated with the current user
  */

  // we want to get the cart associated with the current user
  // ? getCart() method is a special method accessable to user because the relations/association with other table/model
  req.user
    .getCart()
    .then((cart) => {
      return cart.getProducts();
    })
    .then((cartProducts) => {
      console.log("this is the cart products", cartProducts);
      res.render("shop/cart", {
        path: "/cart",
        pageTitle: "Your Cart",
        products: cartProducts, // its an array of product objects
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;

  let fetchedCart;
  let newQuantity = 1; // quantity for newly added product
  req.user
    .getCart()
    .then((cart) => {
      fetchedCart = cart;
      return cart.getProducts({ where: { id: prodId } });
    })
    .then((products) => {
      /* 
        ! we want to check first if the product already exist in cart or not
          if the product is already in the cart, increment the quantity
          if the product doesn't exist in the cart, add it with 1 quantity
      */
      let product;
      if (products.length > 0) {
        product = products[0];
      }
      if (product) {
        // ! if product already exist in the cart
        const oldQuantity = product.cartItem.quantity;
        newQuantity = oldQuantity + 1;
        return product;
      }
      return Product.findByPk(prodId);
    })
    .then((product) => {
      return fetchedCart.addProduct(product, {
        through: {
          // passing data into the extra attribute of the intermediary table
          quantity: newQuantity,
        },
      });
    })
    .then((result) => {
      res.redirect("/cart");
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postCartDelete = (req, res, next) => {
  /* 
    we want to get the specific item in the cart using id
    then delete (destroy) the item in the intermediary table
  */
  const prodId = req.body.productId;
  req.user
    .getCart()
    .then((cart) => {
      return cart.getProducts({ where: { id: prodId } });
    })
    .then((products) => {
      let product = products[0];
      // deleting the product in cart
      return product.cartItem.destroy();
      /* 
        why not product.destroy()? 
        ! because if we do that we will delete the product off the prodcuts table
        and we only want to delete the product from the cart,
        so we delete the product in the cartItem, that represents the products stored in cart 
      */
    })
    .then((result) => {
      res.redirect("/cart");
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postOrder = (req, res, next) => {
  let fetchedCart;
  req.user
    .getCart()
    .then((cart) => {
      fetchedCart = cart;
      return cart.getProducts();
    })
    .then((products) => {
      return req.user
        .createOrder() // making an order and attaching it with the user id
        .then((order) => {
          // addProducts recieves array as the argument
          return order.addProducts(
            products.map(
              // ! map method will recreate the product array with the result of the callback function as it's values
              (product) => {
                // ! this is the callback function
                // we want to add additional data into our order
                product.orderItem = { quantity: product.cartItem.quantity };
                return product;
              }
            )
          );
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .then((result) => {
      // emptying the cart
      return fetchedCart.setProducts(null);
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
  req.user
    .getOrders({ include: ["products"] }) // ! explained below
    .then((orders) => {
      /* 
        orders = [{"id": ??, "products": [{"id": ??? ..... }]}]
      
      */

      res.render("shop/orders", {
        path: "/orders",
        pageTitle: "Your Orders",
        orders: orders,
      });
    })
    .catch((err) => console.log(err));

  /* 
      ? why products? because the name of the model is product and has many to many relation, so sequelize pluralized it to products
      ! we want to get the full detail of the products data in the order
      we can do that because we have established in the app.js file that order and products have many to many relation
      with a magic way called 'eager loading',
      with eager loading we can load the full attributes of associated models
      so in our case here in getOrders(), we will get the full detail of all the products (id, title, price, desc, imageUrl (of each and every one of them!)) 
      so we can use them in the ejs file later
    */
};
