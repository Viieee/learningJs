const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const errorController = require("./controllers/error");
const mongoose = require("mongoose");

const User = require("./models/user");

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
  // ! this middleware only runs for incoming request not when we initially starts the application
  User.findById("6157b8b5b318f96e943da2d4")
    .then((user) => {
      // storing the user into request so it can be accessed from the whole app by other files
      req.user = user; // ! this is a mongoose object, so we can use many methods provided by mongoose aswell
      next(); // ! so the next middleware can run
    })
    .catch((err) => {
      console.log(err);
    });
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

// connecting to the database using mongoose
mongoose
  .connect(
    "mongodb+srv://vieri:pass123.@cluster0.6o5cb.mongodb.net/shop?retryWrites=true&w=majority"
  )
  .then((result) => {
    // ! finding out if we already have a user or not
    return User.findOne();
  })
  .then((user) => {
    if(!user){
      // creating new user
      const user = new User({
        name: "Vieri",
        email: "dummy@email.com",
        cart: {
          items: [],
        },
      });
      user.save();
    }
    app.listen(3000);
  })
  .catch((err) => {
    console.log(err);
  });
