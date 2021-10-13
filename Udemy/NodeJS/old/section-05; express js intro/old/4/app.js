const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const app = express();

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({extended: false}));

app.use('/admin', adminRoutes);
app.use(shopRoutes);

// false route acessed
app.use((req, res, next) => {
    // sending 404 error page file to the user
    res.status(404).sendFile(path.join(__dirname, 'views', '404.html'));
});

app.listen(3000);
