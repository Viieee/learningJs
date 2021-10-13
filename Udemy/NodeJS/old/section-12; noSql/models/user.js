// importing mongoose 
const mongoose = require('mongoose')

// schema object from mongoose
const Schema = mongoose.Schema;

// making new schema
const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    // cart embeeded document in the user
    cart: {
        // array of documents
        items: [{
            productId: {
                // telling mongoose this field will store an object id
                type: Schema.Types.ObjectId,
                ref: 'Product',
                required: true
            },
            quantity: {
                type: Number,
                required: true
            }
        }] 
    }   
})

// adding your own mehtod
userSchema.methods.addToCart = function(product){
    // finding whether the product is already in the cart or not
    const cartProductIndex = this.cart.items.findIndex(cp=>{ // items array in the cart
                                                        // cp is the individual product in the array
      // executing for every element in the items array
      // we want to return true if we find the product in the items array
      return cp.productId.toString() === product._id.toString()
    })

    // default value
    let newQuantity = 1;
    // copying all the data in the items array
    const updatedCartItems = [...this.cart.items];

    if(cartProductIndex >= 0){
      // if the item already exist we adding the quantity by 1
      newQuantity = this.cart.items[cartProductIndex].quantity + 1 ;
      updatedCartItems[cartProductIndex].quantity = newQuantity;
    }else{
      // if the item is new to cart
      // we adding a new one to the array
      updatedCartItems.push(
        {
          // we only want to store product's id
          // and the quantity of the product in cart
          productId: product._id, 
          quantity: newQuantity
        }
      )
    }

    // the cart object
    // the cart object will have 1 key called items
    // items will store an array of object
    // and in the object it will store all the products and the quantity inside of the cart
    const updatedCart = {
      items: updatedCartItems
    }

    this.cart = updatedCart

    // saving the cart
    return this.save();
}

userSchema.methods.deleteItemFromCart = function(productId){
    // filtering the cart items, only getting back all the items that dont have 
        // the id the same as id(the argument of this method)
    const updatedCartItems = this.cart.items.filter(item=>{
        // keeping all the product that dont match the id passed onto this method
        return item.productId.toString() !== productId.toString();
    })
    // altering the value of the items array
    this.cart.items = updatedCartItems;
    // saving the change
    return this.save()
}


userSchema.methods.clearCart = function(){
    this.cart = {items:[]}
    return this.save();
}

// exporting the mongoose model
module.exports = mongoose.model('User', userSchema)