const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const errorController = require("./controllers/error");

// importing the connection pool
const sequelize = require("./util/database");
// importing the models
const Product = require("./models/product");
const User = require("./models/user");
const Cart = require("./models/cart");
const CartItem = require("./models/cart-item");
const Order = require("./models/order");
const OrderItem = require("./models/order-item");

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
  // ! this middleware only runs for incoming request not when we initially starts the application
  User.findByPk(1)
    .then((user) => {
      // storing the user into request so it can be accessed from the whole app by other files
      req.user = user;
      next(); // ! so the next middleware can run
    })
    .catch((err) => {
      console.log(err);
    });
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

// making relations/association
// ! #1
User.hasMany(Product);
Product.belongsTo(User, { constraints: true, onDelete: "CASCADE" });
// ! #2
User.hasOne(Cart);
Cart.belongsTo(User);
// ! #3
Cart.belongsToMany(Product, { through: CartItem });
Product.belongsToMany(Cart, { through: CartItem });
// ! #4
User.hasMany(Order);
Order.belongsTo(User);
// ! #5
Order.belongsToMany(Product, { through: OrderItem });
Product.belongsToMany(Order, { through: OrderItem });

/* 
  ? explanations about the association/relations in this app
  ! #1:
    association between user (as an admin) and product
    its a one (user) to many (products) relation
    one user can have many products created, but each product only have one user that creates it.
    the products model is the child model and the user model is the parent model
    that means the child model (products) will store the parent's (user) id as foreign key 
  ! #2:
    associtation between user (as customer) and cart
    its a one to one relation
    one user only have one cart, and every cart is identified by one user
    the cart model is the child model and the user model is the parent model
    that means the child model (cart) will store the parent's (user) id as foreign key
  ! #3:
    association between product and cart
    its a many to many relation
    one cart can have many products, and one product can be on many carts
    many to many relation require intermediary table, in this case the intermediary table is the cartItem table
    where it will store both the id of the cart and the product and some additional information that can be added 
  ! #4:
    association between user and order
    its a one (user) to many (order) relation
    one user can have many orders, but order can be only identified by one user
    the order model is the child model and the user model is the parent model
    that means the child model (order) will store the parent's (user) id as a foreign key
  ! #5:
    association between order and product
    its a many to many relation 
    one product can be on many orders, and one order can have many products
    many to many relation require intermediary table, in this case the intermediary table is the orderItem
    where it will store both the id of the order and the products and some additional information that can be added
*/

// syncing models to the database by creating the appropriate tables and relations (if theres any)
sequelize
  // .sync({force:true})
  .sync()
  .then((result) => {
    // checking if the dummy user already exist
    return User.findByPk(1);
  })
  .then((user) => {
    if (!user) {
      // if we dont have any dummy user yet, we want to create one
      return User.create({
        name: "Vieri",
        email: "viieee@gmail.com",
      });
    }
    // if we already have a user then return it so the next then method can be executed
    return Promise.resolve(user);
  })
  .then((user) => {
    // making the cart and attach it to the user
    return user.createCart();
  })
  .then((result) => {
    app.listen(3000);
  })
  .catch((err) => {
    console.log(err);
  });
