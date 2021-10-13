const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const errorController = require("./controllers/error");

const User = require("./models/user");

const mongoConnect = require("./util/database").mongoConnect;

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
   // ! this middleware only runs for incoming request not when we initially starts the application
  User.findById("61565f4bd5cc7b5c0e707540")
    .then((user) => {
      // storing the user into request so it can be accessed from the whole app by other files
      // ! old way
      // req.user = user;
      // ! new way, so we can use the methods in user model, not just fetch the data
      req.user = new User(user.username, user.email, user.cart, user._id)
      next(); // ! so the next middleware can run
    })
    .catch((err) => {
      console.log(err);
    });
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

mongoConnect(() => {
  
  app.listen(3000);
});
