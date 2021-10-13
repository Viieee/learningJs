// importing mongoose
const mongoose = require('mongoose');

// importing mongoose schema
const Schema = mongoose.Schema;

// making new schema
const userSchema = new Schema({
  // fields and the configuration of each fields
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  cart: { // embeeded document inside user schema
    items: [
      {
        productId: {
          type: Schema.Types.ObjectId, // telling the type is objectId
          ref: 'Product', // telling mongoose which other collection will be related to this field
                          // so later when we use populate() method we can get the data about items 
                          // in related collection in detail
          required: true
        },
        quantity: { type: Number, required: true }
      }
    ]
  }
});

// adding to cart
userSchema.methods.addToCart = function(product) {
  // we want to check if the product (argument) added to cart is already in the cart
  const cartProductIndex = this.cart.items.findIndex(cp => {
    // finding the idex of the product (argument) added to cart
    // it will return the index number of the product if the product is indeed already exist in the cart
    // it will return undefined if the item doesn't exist
    return cp.productId.toString() === product._id.toString();
  });
  let newQuantity = 1; // default quantity of new product added
  const updatedCartItems = [...this.cart.items]; // copying the cart items array into new variable

  if (cartProductIndex >= 0) {
    // if the item exist we just want to add the quantity by 1
    newQuantity = this.cart.items[cartProductIndex].quantity + 1;
    // updating the item's quantity in cart
    // based on the index we found using findIndex before 
    updatedCartItems[cartProductIndex].quantity = newQuantity;
  } else {
    // if the item is new we want to push the new product into the updatedCartItems
    updatedCartItems.push({
      productId: product._id,
      quantity: newQuantity
    });
  }
  // updated version of cart, the structure has to be the same
  const updatedCart = {
    items: updatedCartItems
  };
  // updating user's cart and altering it with updated version
  this.cart = updatedCart;
  // saving the changes
  return this.save();
};

// removing item from cart
userSchema.methods.removeFromCart = function(productId) {
  // filtering the item based on productId (argument)
  const updatedCartItems = this.cart.items.filter(item => {
    // this variable will contain all the data in the array that
      // don't have the same if as the productId (argument)
    return item.productId.toString() !== productId.toString();
  });
  // updating items in cart with the filtered items
  this.cart.items = updatedCartItems;
  // saving the changes
  return this.save();
};

// clearing the cart after making order
userSchema.methods.clearCart = function() {
  // setting the items in cart into empty array
  this.cart = { items: [] };
  // saving changes
  return this.save();
};

// exporting the schema
module.exports = mongoose.model('User', userSchema);