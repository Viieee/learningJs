// core modules
const path = require("path");

// 3rd party packages
const express = require("express");
const bodyParser = require("body-parser");

// importing files
const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");

// error controller
const errorController = require("./controllers/error");

// initializing express object
const app = express();

// setting the templating engine
app.set("view engine", "ejs");
app.set("views", "views");


// parsing the body
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "public")));

app.use("/admin", adminRoutes);

app.use(shopRoutes);


app.use(errorController.get404);

app.listen(3000);
