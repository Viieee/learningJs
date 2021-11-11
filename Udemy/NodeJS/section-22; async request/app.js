const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

const errorController = require('./controllers/error');

// importing connect-flash
const flash = require('connect-flash');
/* 
 ! Connect-flash module for Nodejs allows the developers to send a message whenever a 
    ! user is redirecting to a specified web-page
  ! the message in connect flash will be stored in the session and will be removed once its being used
*/
const mongoose = require('mongoose');
// package used to manage session
const session = require('express-session');
// mongodb session store, to store session into the database
const MongoDBStore = require('connect-mongodb-session')(session);
// csurf, to generate csrf token
const csurf = require('csurf');
/* 
  ! we want to generate csrf token for every page that can potentially make a change in the user state
    ! and anything that's sensitive, 
  ! this token will be genereated for every page rendered
  example:
  - making an order

  later on when the server recieve the request, it will first check the availability and
  the validity of the token sent together with the request
*/

const User = require('./models/user');

// database server uri
const MONGODB_URI =
  'mongodb+srv://vieri:pass123.@cluster0.6o5cb.mongodb.net/shop?retryWrites=true&w=majority';

const app = express();

// intialize new store
const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: 'sessions', // the collection where the session will be stored
});

// initializing csurf
const csrfProtection = csurf();

//configuration for multer
const fileStorage = multer.diskStorage({
  destination: function (req, file, callback) {
    // ! configuring the path of the file
    // ? if we dont save it in a destination (folder),
    //    it will be saved in the buffer
    callback(null, 'images');
  },
  filename: function (req, file, callback) {
    // ! configuring the filename
    callback(
      null,
      new Date().toISOString().slice(0, 10) + '-' + file.originalname
    );
  },
});

// filtering file for multer
const fileFilter = (req, file, callback) => {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg'
  ) {
    callback(null, true); // if we want to store it
  } else {
    callback(null, false); // if we dont want to store it
  }
};

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single('image')
); // for parsing files
// app.use(
//   multer({ dest: 'images'}).single('image')
// );
/* 
  ! body parser is a tool used to parsed incoming request body
  ! multer is used to parse files in request
    in technical term form it is used to handle multipart/form-data
  the argument passed onto single() method is the name of the input file field 
  in the ejs
*/
app.use(express.static(path.join(__dirname, 'public')));

// serving the images
app.use('/images', express.static(path.join(__dirname, 'images')));
// ? for each request towards url/images/ we will serve the images statically

// session
app.use(
  /* 
    this express session will set the cookie and reads the cookie value for you
  */
  session({
    // session's config
    secret: 'my secret', // ! #1
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

// using flash middleware
app.use(flash());
// ! now we can use the flash middleware anywhere in our app on the request object

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

// extracting the user mongoose object
// ! we need to do this still to use all the methods in the user model
app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id) // finding user id based on the current session's user id
    .then((user) => {
      if (!user) {
        return next();
      }
      // ! req.user contain full user object with all the methods based on current session
      req.user = user;
      next();
    })
    .catch((err) => {
      next(new Error(err)); // this is to trigger the error handler middleware with async code
    });
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.get('/500', errorController.get500);

app.use(errorController.get404);

// error handling middleware
// ! it will only triggers when next(error) passed onto the app
app.use((error, req, res, next) => {
  res.redirect('/500');
});

// connecting to the database using mongoose
mongoose
  .connect(MONGODB_URI)
  .then((result) => {
    app.listen(3000);
  })
  .catch((err) => {
    console.log(err);
  });
