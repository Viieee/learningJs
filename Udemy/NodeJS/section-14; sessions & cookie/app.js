const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");

const errorController = require("./controllers/error");

const mongoose = require("mongoose");
// package used to manage session
const session = require("express-session");
// mongodb session store, to store session into the database
const MongoDBStore = require("connect-mongodb-session")(session);

const User = require("./models/user");

// database server uri
const MONGODB_URI =
  "mongodb+srv://vieri:pass123.@cluster0.6o5cb.mongodb.net/shop?retryWrites=true&w=majority";

const app = express();

// intialize new store
const store = new MongoDBStore({
  uri: MONGODB_URI, 
  collection: "sessions", // the collection where the session will be stored
});

app.set("view engine", "ejs");
app.set("views", "views");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// session
app.use(
  /* 
    this express session will set the cookie and reads the cookie value for you
  */
  session({
    // session's config
    secret: "my secret", // ! #1
    resave: false, // ! #2
    saveUninitialized: false, // ! #3
    store: store, // ! #4
    /* 
      ! #1. signing the hash
      ! #2. session won't be saved on every request that is done / response that is sent
      !     but only when something changed in the session
      ! #3. ensuring that no session is saved if nothing is changed 
      ! #4. using the store as session store
    */
  })
);

// ! we need to do this still to use all the methods in the user model
app.use((req,res,next)=>{
  if(!req.session.user){
    return next();
  }
  User.findById(req.session.user._id) // finding user id based on the current session's user id
    .then(user => {
      // ! req.user contain full user object with all the methods based on current session
      req.user = user
      next();
    })
    .catch(err => console.log(err));
})


app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorController.get404);

// connecting to the database using mongoose
mongoose
  .connect(MONGODB_URI)
  .then((result) => {
    // ! finding out if we already have a user or not
    return User.findOne();
  })
  .then((user) => {
    if (!user) {
      // creating new user
      const user = new User({
        name: "Vieri",
        email: "dummy@email.com",
        cart: {
          items: [],
        },
      });
      user.save();
    }
    app.listen(3000);
  })
  .catch((err) => {
    console.log(err);
  });
