// importing global module
const path = require('path');

// importing third party package
const express = require('express');
const bodyParser = require('body-parser');

// controller for error/invalid urls
const errorController = require('./controllers/error');

// importing connection pool
const sequelize = require('./util/database');
// importing models for the database
const Product = require('./models/product');
const User = require('./models/user');
const Cart = require('./models/cart');
const CartItem = require('./models/cart-item');
const Order = require('./models/order');
const OrderItem = require('./models/order-item');

// initializing express into an object that we can reuse the methods later
const app = express();

// setting the view engine
  // in this case we're using ejs
app.set('view engine', 'ejs');
  // we're directing ejs to the views folder, which the ejs file should stored in
app.set('views', 'views');

// importing the router files
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

// parsing the body of the request sent through a form using body parser package
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// making middleware to store the current user logged in
// this middleware will execute once we're done with the server initialization
app.use((req, res, next) => {
  // first we find the user with the id passed onto the argument of the findByPk method
  User.findByPk(1)
    .then(user => {
      // then we passed in the value we gained from the findByPk method into req.user
        // so we can access the user info anywhere from the app
      req.user = user; 
      next();
    })
    .catch(err => console.log(err));
});

// using imported middleware to manage access into urls in the app
app.use('/admin', adminRoutes);
app.use(shopRoutes);

// middleware that will execute when user trying to access invalid urls
app.use(errorController.get404);

// database relations using sequelize
  // 1. relation between user as admin and the products they added to the db
    // its a one(user) to many(product) relation
    // one user can add many products
    // products only have 1 user that added them
    // products is the child model, user is the parent model
    // what that means is the products model table will store the user id
    // but the user table won't store product table's id
Product.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
User.hasMany(Product);
  // 2. relation between user and cart
    // its a one to one relation
    // every user only have one cart
    // every cart identified to one user
User.hasOne(Cart);
Cart.belongsTo(User);
  // 3. relation between cart and product
    // its a many to many relation
    // a cart can have many products
    // a product can be on many carts
    // many to many relations require intermediary table
    // CartItem is the intermediary table
Cart.belongsToMany(Product, { through: CartItem });
Product.belongsToMany(Cart, { through: CartItem });
  // 4. relation between user and order
    // its a one (user) to many (order) relation
    // every user can have many orders
    // whie each orders attached to only one user
Order.belongsTo(User);
User.hasMany(Order);
  // 5. relation between order and products
    // its a many to many relation
    // an order can have many products
    // a product can be on many orders
    // many to many relations require intermediary table
    // OrderItem is the intermediary table
Order.belongsToMany(Product, { through: OrderItem });

// with the sequelize object, we can use all methods offered by the Sequelize package
// one of them is (in this case) sync method
  // the method will create tables based on the models you have in the app (in this case in the models folder)
  // if the table doesn't exist yet, if its already exist it does nothing.
sequelize
  .sync()
  .then(result => {
    // this will execute after we finished with the sync method
    // The findByPk method obtains only a single entry from the table, 
      // using the provided primary key.
      // and in this case the primary key is the id
    // we want to find a user with the id of '1'
    // then we return the value we get
    return User.findByPk(1);
  })
  .then(user => {
    // this will execute after we finished with finding user with the id we lookin for
    // the parameter in this then method is passed on by the returned value from 
      // previous then method
    // if the search in previous then method yields undefined
    // that means we don't have the user yet
    // so we want to create new user if that's the case
    if (!user) {
      // creating new user then returning it so we can process it in the next then method
      return User.create({
        name: 'Vieri',
        email: "dummyEmail@gmail.com" 
      });
    }
    // if the user exist then we return the value of the user again
      // so we can process it in the next then method
    return user;
  })
  .then(user => {
    // this createCart method is a magic method generated by sequelize package 
    // its one of three available methods generated when we associate one model to another
      // with one to one relation
    // Cart in createCart method is generated because the cart model is the child in 
      // the relation between cart and user
    
    // the createCart method will create method and attach it with user currently logged in
      // it will store user's id into cart's table  
    return user.createCart();
  })
  .then(cart => {
    // after all previous then methods finsihed, we start the server.
    app.listen(3000);
  })
  .catch(err => {
    console.log(err);
  });
