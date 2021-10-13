const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const expressHbs = require('express-handlebars');

const app = express();

// telling express that there's templating engine available
app.engine(
  'hbs', // name, used for the later html file extension
  expressHbs({ // the handlebars
    // config
    layoutsDir: 'views/layouts/', // the layout's directory
    defaultLayout: 'main-layout', // the name of the layout file
    extname: 'hbs' // the extension of the layout file
  })
);
app.set('view engine', 'hbs');
app.set('views', 'views');

const adminData = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin', adminData.routes);
app.use(shopRoutes);

app.use((req, res, next) => {
  res.status(404).render('404', { pageTitle: 'Page Not Found' });
});

app.listen(3000);
