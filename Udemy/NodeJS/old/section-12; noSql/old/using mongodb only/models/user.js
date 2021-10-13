// importing mongoDB
const mongodb = require('mongodb')
// importing access to the database
const getDb = require('../util/database').getDb;

class User {
  constructor(username, email, cart, id){
    this.name = username
    this.email = email
    // storing cart in user object
    this.cart = cart; // cart will look like this => {items: []}
    this._id = id;
  }

  save(){
    // get access to the database
    const db = getDb();
    return db.collection('users')
    .insertOne(this)
    .then(result=>{
      console.log(result)
    })
    .catch(err=>{
      console.log(err)
    })
  }


  // fetching the data in cart and displaying it
  getCart(){
    // we want to return the cart items
    // so later in the shop.js controller we can send the data to the ejs file
    // and in this case we can just do it like this
    // return this.cart;
    // but we dont want to do that, we also want to send the product detail with the cart 
    // because right now, we only have the id of each product in the cart collection
    
    // getting access to the database
    const db = getDb();
    // the ids
    // cart.items is an array of objects containing product id and the quantity in the cart
    // we want to map all the ids of the items in the cart
    const productIds = this.cart.items.map(item =>{
      return item.productId
    });
    return db.collection('products')
    // we want to find all the product that exist in cart
    .find({_id: {
      $in: productIds // array of ids, we will get back a cursor which hold references to 
                      // all products with the id mentioned in the array
    }})
    .toArray() // converting the cursor to an array
    .then(products=>{
      // getting all the product
      return products.map(p =>{
        // mapping every item in the array
        // and executing this function on every single item in it
        // and giving extra data to it in quantity field
        return {...p, quantity: this.cart.items.find(i=>{
            // this will return the product object
            return i.productId.toString()===p._id.toString();
          }).quantity // this will make sure that we get the quantity of the product object
        }
      })
    })
  }

  // adding product to cart
  addToCart(product){
    // finding whether the product is already in the cart or not
    const cartProductIndex = this.cart.items.findIndex(cp=>{ // items array in the cart
                                                        // cp is the individual product in the array
      // executing for every element in the items array
      // we want to return true if we find the product in the items array
      return cp.productId.toString() === product._id.toString()
    })

    // default value
    let newQuantity = 1;
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
          productId: new mongodb.ObjectId(product._id), 
          quantity: newQuantity
        }
      )
    }


    // adding new field on the fly
    // product.quantity = 1;
    // or
    // {
    //   {...product}, 
    //   quantity: newQuantity
    // }

    // the cart object
    // the cart object will have 1 key called items
    // items will store an array of object
    // and in the object it will store all the products and the quantity inside of the cart
    const updatedCart = {
      items: updatedCartItems
    }

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

  deleteItemFromCart(id){
    // const updatedCartItems = [...this.cart.items]
    const updatedCartItems = this.cart.items.filter(item=>{
      // keeping all the product that dont match the id passed onto this method
      return item.productId.toString() !== id.toString();
    })

    const db = getDb();

    return db
    .collection('users')
    .updateOne(
      {_id: new mongodb.ObjectId(this._id)},
      {$set: {
        // only updating the value in cart field
        cart: {items: updatedCartItems}
      }}
    )

  }
  
  // getting all the orders into the page
  // we want to get all the orders based on the user
  getOrders(){
    // accessing database
    const db = getDb();
    return db.collection('orders')
    // this will look for _id in user property of orders
      // which holds an embedded document
    .find({'user._id': new mongodb.ObjectId(this._id)})
    .toArray()
  }


  // adding order to user
  // or the other way around
  // you can also store the orders on a new collection if you have huge list of it
  addOrder(){
    // getting access to database
    const db = getDb();
    return this.getCart()
    .then(products=>{
      // we getting the products in cart
      // the order structure
      const order = {
        items: products, // all products in cart + the quantity
        user:{
          _id: new mongodb.ObjectId(this._id),
          name: this.name
        }
      }
      // accessing orders collection
      return db.collection('orders')
      .insertOne(order) // we're inserting the cart we made in this class to orders collection
    })
    .then(result=>{
      this.cart = {items: []} // emptying the cart object
      return db
      .collection('users')
      .updateOne(
        {_id: new mongodb.ObjectId(this._id)},
        {$set: {
          // making the value in cart collection into null 
          cart: {items: []}
        }}
      )
    })
  }


  static findById(id){
    // get access to the database
    const db = getDb();

    // same operation as findById in product model
    return db
    .collection('users')
    .find({_id: new mongodb.ObjectId(id)})
    .next() 
    .then(user=>{
      console.log('find by id' + user)
      return user;
    })
    .catch(err=>{
      console.log(err)
    })
  }
}

module.exports = User;
