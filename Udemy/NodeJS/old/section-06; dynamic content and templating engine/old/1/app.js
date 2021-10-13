const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const app = express();

// setting global config value
app.set('view engine', 'pug'); // telling express to use the second argument as 
                               // the handler for any dynamic templates we're trying to render
// setting the view folder (the folder containing the html files)
app.set('views', 'views') // the second argument is the folder


const adminData = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin', adminData.routes);
app.use(shopRoutes);

app.use((req, res, next) => {
    res.status(404).sendFile(path.join(__dirname, 'views', '404.html'));
});

app.listen(3000);
