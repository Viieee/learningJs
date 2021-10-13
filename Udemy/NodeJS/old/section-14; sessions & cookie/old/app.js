const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
// importing mongoose
const mongoose = require('mongoose');
// importing session
const session = require('express-session');
// importing the express session store
const MongoDBStore = require('connect-mongodb-session')(session);

// database uri
const MONGODB_URI = 'mongodb+srv://vie:pass123@cluster0.kbsee.mongodb.net/shop?retryWrites=true&w=majority'


const errorController = require('./controllers/error');
const User = require('./models/user');

const app = express();
// initialize new store
const store = new MongoDBStore({
  uri: MONGODB_URI, // database uri
  collection: 'sessions' // the name of the collection
});


app.set('view engine', 'ejs');
app.set('views', 'views');


const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
// session middleware
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

app.use((req, res, next) => {
  // User.findById('60c5395ba98da70520a7b8ee')
  //   .then(user => {
  //     req.user = user;
  //     next();
  //   })
  //   .catch(err => console.log(err));
  if (!req.session.user) {
    return next();
  }
  // finding 
  User.findById(req.session.user._id)
    .then(user => {
      req.user = user;
      next();
    })
    .catch(err => console.log(err));
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorController.get404);

mongoose
  .connect(MONGODB_URI)
  .then(result => {
    User.findOne().then(user => {
      if (!user) {
        const user = new User({
          name: 'Vieri',
          email: 'dummyemail@gmail.com',
          cart: {
            items: []
          }
        })
        user.save();
      }
    });
    app.listen(3000);
  })
  .catch(err => {
    console.log(err);
  });
