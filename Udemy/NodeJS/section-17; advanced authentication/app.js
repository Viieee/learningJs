const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");

const errorController = require("./controllers/error");

// importing connect-flash
const flash = require("connect-flash");
/* 
 ! Connect-flash module for Nodejs allows the developers to send a message whenever a 
    ! user is redirecting to a specified web-page
  ! the message in connect flash will be stored in the session and will be removed once its being used
*/
const mongoose = require("mongoose");
// package used to manage session
const session = require("express-session");
// mongodb session store, to store session into the database
const MongoDBStore = require("connect-mongodb-session")(session);
// csurf, to generate csrf token
const csurf = require("csurf");
/* 
  ! we want to generate csrf token for every page that can potentially make a change in the user state
    ! and anything that's sensitive, 
  ! this token will be genereated for every page rendered
  example:
  - making an order

  later on when the server recieve the request, it will first check the availability and
  the validity of the token sent together with the request
*/

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

// initializing csurf
const csrfProtection = csurf();
// using flash middleware
app.use(flash());
// ! now we can use the flash middleware anywhere in our app on the request object

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

// using the csrf protection middleware // ! this middleware has to be use after the session
app.use(csrfProtection);
/* 
  ! we have to passed in csrf token to our views too
  the name attribute in the input has to be '_csrf'
*/

// extracting the user mongoose object
// ! we need to do this still to use all the methods in the user model
app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id) // finding user id based on the current session's user id
    .then((user) => {
      // ! req.user contain full user object with all the methods based on current session
      req.user = user;
      next();
    })
    .catch((err) => console.log(err));
});

// ! telling express theres some data that we want to include on every rendered view using res.locals
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  // calling next so we are able to continue
  next();

  /* 
    ! now every response that renders views will include isAuthenticated and csrfToken to be passed onto the views
  */
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorController.get404);

// connecting to the database using mongoose
mongoose
  .connect(MONGODB_URI)
  .then((result) => {
    app.listen(3000);
  })
  .catch((err) => {
    console.log(err);
  });
