// importing mongoose
const mongoose = require("mongoose");

// schema object from mongoose
const Schema = mongoose.Schema;

// making new schema
const user = new Schema({
  // name: {
  //   type: String,
  //   required: true,
  // },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  resetToken: String, // this field isn't always required
  resetTokenExpiration: Date,  // this field isn't always required
  // cart embeeded document in the user
  cart: {
    items: [
      // array of documents
      {
        productId: {
          // telling mongoose this field will store an object id
          type: Schema.Types.ObjectId,
          ref: "Product", // ! telling mongoose the other model related to this field
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
      },
    ],
  },
});

// adding methods to schema
user.methods.addToCart = function (product) {
  /* 
    ! the function has to be written like this so the 'this' still relate to the schema itself
    ! this method can be access using req.user.addToCart()
  */
  const cartProductIndex = this.cart.items.findIndex((cp) => {
    return cp.productId.toString() === product._id.toString(); // this will return the index of the product if the product is already in the cart
    // ? we converting product._id to string because its still in objectId type and we cant compare it '===' to a string
    // ? we can also just use '==' when comparing the two
  });

  let newQuantity = 1;
  const updatedCartItems = [...this.cart.items];

  if (cartProductIndex >= 0) {
    // ! this will execute if the product already in the cart
    newQuantity = this.cart.items[cartProductIndex].quantity + 1;
    updatedCartItems[cartProductIndex].quantity = newQuantity;
  } else {
    // ! if the product is new to the cart
    updatedCartItems.push({
      productId: product._id, // ! mongoose will automatically wrap it in objectId
      quantity: newQuantity,
    });
  }

  // adding product to the cart
  const updatedCart = {
    items: updatedCartItems,
  };

  // rewritting our current cart to the new one
  this.cart = updatedCart;

  // saving the changes
  return this.save();
};

user.methods.deleteItemFromCart = function (id) {
  /* 
    ! the function has to be written like this so the 'this' still relate to the schema itself
    ! this method can be access using req.user.deleteItemFromCart()
  */

  // delete the product using filter
  const updatedCartItems = this.cart.items.filter((item) => {
    // ! this will return all the product in cart that doesn't match the id of the passed on argument of this method
    return item.productId.toString() !== id.toString();
  });

  // rewritting the value of the cart
  this.cart.items = updatedCartItems;

  // saving the change
  return this.save();
};

// clearing the cart after an order made
user.methods.clearCart = function () {
  /* 
    ! the function has to be written like this so the 'this' still relate to the schema itself
    ! this method can be access using req.user.clearCart()
  */
  this.cart = { items: [] };
  return this.save();
};

// exporting the mongoose model
module.exports = mongoose.model("User", user);

/* 
  ? model is important for connecting a schema with a name
  ? in other word, we are naming our schema with model() method 
  ! later on in the database, mongoose will take the lowercased + plural form of our model name
  example;
  Product => products
*/

// const mongodb = require("mongodb");
// const getDb = require("../util/database").getDb;

// class User {
//   constructor(username, email, cart, id) {
//     this.username = username;
//     this.email = email;
//     this.cart = cart; // {items: []}
//     this._id = new mongodb.ObjectId(id);
//   }

//   // saving the object instantiated with this class to the collection
//   save() {
//     // getting access to the database
//     const db = getDb();
//     return db
//       .collection("user")
//       .insertOne(this)
//       .then((result) => {
//         console.log(result);
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   }

//   // adding product to user's cart
//   addToCart(product) {
//     const cartProductIndex = this.cart.items.findIndex((cp) => {
//       return cp.productId.toString() === product._id.toString(); // this will return the index of the product if the product is already in the cart
//       // ? we converting product._id to string because its still in objectId type and we cant compare it '===' to a string
//       // ? we can also just use '==' when comparing the two
//     });

//     let newQuantity = 1;
//     const updatedCartItems = [...this.cart.items];

//     if (cartProductIndex >= 0) {
//       // ! this will execute if the product already in the cart
//       newQuantity = this.cart.items[cartProductIndex].quantity + 1;
//       updatedCartItems[cartProductIndex].quantity = newQuantity;
//     } else {
//       // ! if the product is new to the cart
//       updatedCartItems.push({
//         productId: new mongodb.ObjectId(product._id),
//         quantity: newQuantity,
//       });
//     }

//     // adding product to the cart
//     const updatedCart = {
//       items: updatedCartItems,
//     };
//     /*
//       ! alternative code
//       const updatedCart = { items: [{ ...product, quantity: 1 }] }; => this will store the entire data of the product
//     */

//     // getting access to the database
//     const db = getDb();

//     // ! we want to add new field to the user model, we use update then specify the new field with $set, it will then append the new field on the model

//     // appending the user with new field, cart.
//     return db
//       .collection("user")
//       .updateOne({ _id: this._id }, { $set: { cart: updatedCart } });
//   }

//   getCart() {
//     /*
//       we want to return the cart items and outputing it on the templating engine
//       we will fetched the full populated referenced data
//     */

//     // ! #1
//     const db = getDb();

//     // ! #2
//     const productIds = this.cart.items.map((item) => {
//       return item.productId;
//     });

//     // ! #3
//     return (
//       db
//         .collection("product")
//         .find({ _id: { $in: productIds } })
//         /*
//         ? the find method explained:
//         selects all document in product collection where the _id matched any id stored in productIds array
//       */
//         .toArray()
//         // ! #4
//         .then((products) => {
//           return products.map((product) => {
//             // ! this function will be executed on every single value in products array
//             return {
//               ...product,
//               quantity: this.cart.items.find((i) => {
//                 return i.productId.toString() === product._id.toString();
//               }).quantity,
//             };
//           });
//         })
//         .catch((err) => {
//           console.log(err);
//         })
//     );

//     /*
//       this method explanation:
//       ! #1. getting access to the database
//       ! #2. storing the ids of the products in the cart, we will need it later
//       ! #3. we want to know all the product existed in cart that also existed in product collection, we use $in for this
//       ! #4. transform the data we get back (after converting it to an array from a cursor) so we can have both the product full populated data and the quantity

//     */
//   }

//   deleteItemFromCart(id) {
//     const updatedCartItems = this.cart.items.filter((item) => {
//       return item.productId.toString() !== id.toString();
//     });

//     // getting access to the database
//     const db = getDb();

//     return db
//       .collection("user")
//       .updateOne(
//         { _id: this._id },
//         { $set: { cart: { items: updatedCartItems } } }
//       );
//   }

//   addOrder() {
//     const db = getDb();
//     // getting the products in the cart
//     return this.getCart()
//       .then((products) => {
//         const order = {
//           items: products,
//           user: {
//             _id: new mongodb.ObjectId(this._id),
//             name: this.username,
//             email: this.email,
//           },
//         };
//         return db.collection("order").insertOne(order);
//       })
//       .then((result) => {
//         // if succeed, empty the array
//         // ! clearing the cart in user object
//         this.cart = { items: [] };
//         // ! clearing the cart in the database
//         return db.collection("user").updateOne(
//           { _id: new mongodb.ObjectId(this._id) },
//           // cart: { items: [{productId: ??, quantity: ??}]}
//           { $set: { cart: { items: [] } } }
//         );
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   }

//   getOrders() {
//     // getting access to the database
//     const db = getDb();
//     return db
//       .collection("order")
//       .find({ "user._id": new mongodb.ObjectId(this._id) })
//       /*
//         ? find method explained:
//         we want to filter all the orders of only the current user
//         so the "user._id" is a command to mongo to look for the id of the user field (for nested properties)
//       */
//       .toArray();
//   }

//   // finding the specific user based on the id
//   static findById(id) {
//     // getting access to the database
//     const db = getDb();
//     return db
//       .collection("user")
//       .find({ _id: new mongodb.ObjectId(id) })
//       .next()
//       .then((user) => {
//         return user;
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   }
// }

// module.exports = User;

// /* const Sequelize = require("sequelize").Sequelize;

// const sequelize = require("../util/database");

// const User = sequelize.define("user", {
//   id: {
//     type: Sequelize.INTEGER,
//     autoIncrement: true,
//     allowNull: false,
//     primaryKey: true,
//   },
//   name: {
//     type: Sequelize.STRING,
//     allowNull: false,
//   },
//   email: {
//     type: Sequelize.STRING,
//     allowNull: false,
//   },
// });

// module.exports = User;
//  */
