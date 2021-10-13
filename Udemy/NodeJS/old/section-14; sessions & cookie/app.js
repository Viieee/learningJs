// importing path module
const path = require('path');

// third party packages
const express = require('express');
const bodyParser = require('body-parser');
// importing mongoose
const mongoose = require('mongoose');
// importing express session
const session = require('express-session');
// mongodb session, to store session into mongodb
const MongoDBStore = require('connect-mongodb-session')(session);

const errorController = require('./controllers/error');
const User = require('./models/user');

// server uri
const MONGODB_URI =
  'mongodb+srv://vie:pass123@cluster0.kbsee.mongodb.net/shop?retryWrites=true&w=majority';

// making object with express
const app = express();
// intialize new store
const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: 'sessions'
});

// setting ejs as the view engine
  // and views folder as the target for ejs to look for the ejs files
app.set('view engine', 'ejs');
app.set('views', 'views');

// routes
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

// middlewares
// bodyparser, parsing the body of the request sent through a form
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
// session
app.use(
  session({
    // configuration
    secret: 'my secret', // signing the hash
    resave: false, // this means that the session will not be saved on every request that is done / response that is sent
                   // but only when something changed in the session
    saveUninitialized: false, // ensuring that no session is saved for a request where it doesn't need to be saved
                              // because nothing was changed about it
    store: store // storing session data
  })
);

app.use((req,res,next)=>{
  if(!req.session.user){
    return next();
  }
  User.findById(req.session.user._id) // finding user id based on the current session
    .then(user => {
      // req.user contain full user object with all the methods based on current session
      req.user = user
      next();
    })
    .catch(err => console.log(err));
})

// using the routes
app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);
app.use(errorController.get404);

// connecting to database using mongoose
mongoose
  .connect(MONGODB_URI) // the server database
  .then(result => {
    // after we connected to database
    // we want to check  if there's any user in the users collection
    User
    .findOne() // we want to find one user in the collection
    .then(user => {
      // if we find any it will returned to this then method
      if (!user) {
        // if theres no user we want to create new user
        const user = new User({
          name: 'Vieri',
          email: 'dummyemail@gmail.com',
          cart: {
            items: []
          }
        })
        // saving newly crated user
        user.save();
      }
    });
    // run the server
    app.listen(3000);
  })
  .catch(err => {
    console.log(err);
  });
