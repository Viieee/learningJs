const express = require('express');
const bodyParser = require('body-parser');

const app = express();

// importing the routing code
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({extended: true}));

// valid middleware function
// so you can just use it like this
app.use('/admin', adminRoutes); // the first argument is the filter to the routes
                                // so all the middleware in the adminRoutes Router file
                                // is available in url/admin/
app.use(shopRoutes);
// the order of the middleware above matters when you use the use() method
// and it can be solved with using the get/post/delete/put etc routes methods
// why?
// those other methods will make sure that the middleware will only execute 
// on the exact path regardless the position in the code

// error 404 page, for when the route the user tried to access is not available
app.use((req,res,next)=>{
    res.status(404).send('<h1>Page not found!</h1>')
})


app.listen(3000);
