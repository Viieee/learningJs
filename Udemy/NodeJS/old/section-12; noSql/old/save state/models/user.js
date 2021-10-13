const mongodb = require('mongodb');
const getDb = require('../util/database').getDb;

const ObjectId = mongodb.ObjectId;

class User {
  constructor(username, email, cart, id) {
    this.name = username;
    this.email = email;
    this.cart = cart; // {items: []}
    this._id = id;
  }

  save() {
    const db = getDb();
    return db.collection('users').insertOne(this);
  }

  addToCart(product) {
    // const cartProductIndex = this.cart.items.findIndex(cp => {
    //   return cp.productId.toString() === product._id.toString();
    // });
    // let newQuantity = 1;
    // const updatedCartItems = [...this.cart.items];

    // if (cartProductIndex >= 0) {
    //   newQuantity = this.cart.items[cartProductIndex].quantity + 1;
    //   updatedCartItems[cartProductIndex].quantity = newQuantity;
    // } else {
    //   updatedCartItems.push({
    //     productId: new ObjectId(product._id),
    //     quantity: newQuantity
    //   });
    // }
    // const updatedCart = {
    //   items: updatedCartItems
    // };
    // const db = getDb();
    // return db
    //   .collection('users')
    //   .updateOne(
    //     { _id: new ObjectId(this._id) },
    //     { $set: { cart: updatedCart } }
    //   );


    // adding new field on the fly
    // product.quantity = 1;
    // or
    //{...product, quantity=1}
    const updatedCart = {items: [{productId: new ObjectId(product._id), quantity: 1}]}

    // updating user to store the cart in there
    const db = getDb();

    return db
    .collection('users')
    .updateOne(
      {_id: new mongodb.ObjectId(this._id)},
      {$set: {
        // only updating the value in cart field
        cart: updatedCart
      }}
    )
  }

  static findById(userId) {
    const db = getDb();
    return db
      .collection('users')
      .findOne({ _id: new ObjectId(userId) })
      .then(user => {
        console.log(user);
        return user;
      })
      .catch(err => {
        console.log(err);
      });
  }
}

module.exports = User;
