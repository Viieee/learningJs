// importing global module
const path = require('path');

// importing third party package
const express = require('express');
const bodyParser = require('body-parser');

// controller for error/invalid urls
const errorController = require('./controllers/error');

// importing mongoDb connection
const mongoConnect = require('./util/database').mongoConnect

// importing user model
const User = require('./models/user')

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
  User.findById('60c2e2de5f79522ca5cf57f8')
  .then(user=>{
    req.user = new User(user.name, user.email, user.cart, user._id)
    next();
  })
  .catch(err=>{
    console.log(err)
  })
});

// using imported middleware to manage access into urls in the app
app.use('/admin', adminRoutes);
app.use(shopRoutes);

// middleware that will execute when user trying to access invalid urls
app.use(errorController.get404);

mongoConnect(()=>{
  app.listen(3000);
})