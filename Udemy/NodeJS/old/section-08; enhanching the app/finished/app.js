// this file will be executed because of nodemon
// look at the package.json file, in scripts we are executing this file

// dependencies of this app
    // global module
const path = require('path');
    // modules exported
const express = require('express');
const bodyParser = require('body-parser');

// file required to render the error page
const errorController = require('./controllers/error');

// storing the initialized express module into an object
// so we can utilize all the express features and implement it 
// on this app
const app = express();

// setting the view engine/templating engine
// in this case we are using ejs
app.set('view engine', 'ejs');
    // the second argument is the folder of the ejs files we stored in
app.set('views', 'views');

// routes
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

// parsing the body of the request sent through a form
// parser used is body-parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// middleware that will handle the functions that will execute when we 
// access the urls
    // when we want to access anything in url/admin, the adminRoutes will handle it
    // the adminRoutes is a separate router file in the routes folder
app.use('/admin', adminRoutes);
    // when we first open the web or the url/ the shopRoutes will handle it
    // shopRoutes is a router file in the routes folder
app.use(shopRoutes);

// error controller, functions as the controller if the user enter invalid url
// it will render an error page
app.use(errorController.get404);

// listening to the connections on the specified host and port
// you can access this app on the localhost:3000 in this case
// because we listen to port 3000
app.listen(3000);
