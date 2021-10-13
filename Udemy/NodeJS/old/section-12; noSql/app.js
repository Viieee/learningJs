// importing global module
const path = require('path');

// importing third party package
const express = require('express');
const bodyParser = require('body-parser');

// importing mongoose
// ! #1
const mongoose = require('mongoose');

// controller for error/invalid urls
const errorController = require('./controllers/error');

// importing mongoDb connection
// const mongoConnect = require('./util/database').mongoConnect

// importing user model
// ! #2
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
  User.findById('60c5395ba98da70520a7b8ee')
  .then(user=>{
    // we getting back a mongoose model
    // so we can use all the mongoose method on the user object and the user stored in req
    req.user = user // ! #3
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

// mongoConnect(()=>{
//   app.listen(3000);
// })

// connecting to the database using mongoose
// ! #4
mongoose
.connect('mongodb+srv://vie:pass123@cluster0.kbsee.mongodb.net/shop?retryWrites=true&w=majority')
.then(result=>{
  // after we successfully connect to the database

  // finding the user if its already created or not
    // findOne will returning back the first user document it finds
  User.findOne().then(user=>{
    // if the user is not set
    // meaning the user collection is empty
    if(!user){
      // then we want to create new user

      // creating user when we start our server
      const user = new User({
        name: 'Vieri',
        email: 'dummyemail@gmail.com',
        cart: {
          items: []
        }
      })

      // saving the user
      user.save()
    }
  })

  

  // listening to port 3000
  app.listen(3000);
})
.catch(err=>{
  console.log(err)
})