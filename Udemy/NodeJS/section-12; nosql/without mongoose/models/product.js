const mongodb = require("mongodb");
const getDb = require("../util/database").getDb;
class Product {
  constructor(title, price, imageUrl, description, id, userId) {
    this.title = title;
    this.price = price;
    this.imageUrl = imageUrl;
    this.description = description;
    this._id = id ? mongodb.ObjectId(id) : null;
    // ? if the id is present, id property is set to the argument passed onto the class on initiation
    // ? if not then set it to null

    this.userId = userId
  }

  // save the product
  save() {
    // getting access to the database
    const db = getDb();

    // storing the operation we're doing, whether it's adding or updating
    let dbOp;

    if (this._id) {
      dbOp = db
        .collection("product")
        .updateOne({ _id: this._id }, { $set: this });
      // ! 'this' refers to the product created with this class

      /* 
        ? set is the syntax used to edit document in mongo
        ! alternative code for $set
        $set: {
          title: this.title,
          price: this.price,
          imageUrl: this.imageUrl,
          description: this.description
        }
      */
    } else {
      dbOp = db.collection("product").insertOne(this);
      // ! 'this' refers to the product created with this class
    }

    // executing the operation based on passed on data on this class instantiation
    return dbOp
      .then((result) => {
        console.log(result);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  // getting all products
  static fetchAll() {
    // getting access to the database
    const db = getDb();
    return db
      .collection("product")
      .find()
      .toArray()
      .then((products) => {
        return products;
      })
      .catch((err) => {
        console.log(err);
      });
    /* 
      ! find() returns a cursor
      ! toArray() turns it to an array and its also a promise 
    */
  }

  // getting specific product
  static findById(id) {
    // getting access to the database
    const db = getDb();

    return db
      .collection("product")
      .find({ _id: new mongodb.ObjectId(id) })
      .next()
      .then((product) => {
        // return the fetched product
        return product;
      })
      .catch((err) => {
        console.log(err);
      });
    /* 
      ? in find method we want to find a specific document based on its id,
      ? and to do that we need to convert our string id into objectId
      ? because our id in the collection is on that type, so inserting a string won't do
      ! find() returns a cursor
      ! next() will return the first document matched with the query of the find() method
    */
  }

  // deleting product
  static deleteById(id) {
    // getting access to the database
    const db = getDb();
    return db
      .collection("product")
      .deleteOne({ _id: new mongodb.ObjectId(id) })
      .then((result) => {
        console.log("product deleted!");
      })
      .catch((err) => {
        console.log(err);
      });
  }
}

module.exports = Product;

/* 
const Product = sequelize.define("product", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  title: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  price: {
    type: Sequelize.DOUBLE,
    allowNull: false,
  },
  imageUrl: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  description: {
    type: Sequelize.TEXT,
    allowNull: false,
  },
});

module.exports = Product;
 */
