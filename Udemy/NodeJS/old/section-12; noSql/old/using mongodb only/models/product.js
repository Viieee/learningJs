// importing mongoDB
const mongodb = require('mongodb')
// importing access to the database
const getDb = require('../util/database').getDb;

class Product {
  constructor(title, price, imageUrl, description, id, userId){
    // data we want to recieve when we initialize this class to make an object
    this.title = title
    this.price = price
    this.imageUrl = imageUrl
    this.description = description
    // optional
    // converting it to object id
    // if id exist we want to convert the id
    // if not it will be null
    this._id = id ? mongodb.ObjectId(id) : null
    // user id
    this.userId = userId
  }

  // saving the object created with this class to database
  save(){
    // get access to the database
    const db = getDb();
    // containing operation we're doing in this method
    let dbOp;

    // checking if the _id is being passed on when we initialize this class
    // that means we want to edit an existing product not adding new one
    if(this._id){
      // editing product
      // we want to update one document in products collection that has the same id as the id we recieved on this class initialization
      dbOp = db.collection('products')
      .updateOne(
        {_id: this._id},
        // this $set key is the syntax used to edit in mongo (its called update operator in google)
        {$set: this}
        // or 
        // {$set: {
        //   title: this.title,
        //   price: this.price,
        //   imageUrl: this.imageUrl,
        //   description: this.description
        // }}
      )
    }else{
      // adding new product

      // telling mongoDb which collection you want to work with
      // if its not exist then it will be created
      // you can insert data with insertOne() or insertMany()
      // insertOne() will take an object 
      // db.collection('products').insertOne({name: 'A Book', price: 99})
      // insertMany() will take an array of objects

      // in this case we want to insert the object we created through this class
      // then we want to store the operation in the dbOp
      dbOp = db.collection('products').insertOne(this)
    }

    // then returning it to give the caller some value
    return dbOp
    .then(result=>{
      console.log(result)
    })
    .catch(err=>{
      console.log(err)
    })

    
    
  }

  // interact with the mongoDB to fetch all products
  static fetchAll(){
    // getting access to the database
    const db = getDb();
    // telling which collection do we want to access
    // in this case, we want to access products collection
    return db.collection('products')
    .find() // then we want to find the documents
            // find is a method provided by mongo that returns cursor
            // cursor is basically returning all the data (or in mongo terms its called documents)
            // and with cursor, we're passing the data one by one
    .toArray() // we can turn the documents into array with toArray method
    .then(products=>{
      // what we get in this then method is the documents/record/data from the collection 
      // we defined in the collection method in the beginning 
      // that have been converted into an array
      return products;
    })
    .catch(err=>{
      console.log(err)
    })
  }

  // finding a product based on id
  static findById(id){
    // getting access to the database
    const db = getDb();
    // we are gonna return a value fetched from products collection
    // and we're trying to find one document with the id the same as the one passed onto this
      // method when called
    return db
    .collection('products')
    .find({_id: new mongodb.ObjectId(id)}) // finding the document with the id the same as the argument of this method
                                       // this find method will return a cursor
                                       // the ObjectId method that wrap our id is tasked to convert our id (which in string)
                                       // into object id
                                       // why?
                                       // because mongodb is using bson (a special type of json) and 
                                       // comparing the id in mongo with just regular string will yield null 
    .next() // fetching the last (in this case the only one) document from the cursor
    .then(product=>{
      console.log('find by id' + product)
      return product;
    })
    .catch(err=>{
      console.log(err)
    })
  }
  
  // deleting product
  static deleteById(id){
    // getting access to the database
    const db = getDb();
    return db.collection('products')
    .deleteOne({_id: mongodb.ObjectId(id)})
    .then(result=>{
      console.log('product deleted')
    })
    .catch(err=>{
      console.log(err)
    })
  }
}

module.exports = Product;
