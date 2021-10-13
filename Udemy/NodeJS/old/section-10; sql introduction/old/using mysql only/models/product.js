// importing the pool
const db = require('../util/database');

// importing cart
const Cart = require('./cart');

module.exports = class Product {
  constructor(id, title, imageUrl, description, price) {
    this.id = id;
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
  }

  save() {
    // saving the data into the database
    // using ? in values to avoid sql injection
    return db.execute('INSERT INTO products (title, price, imageUrl, description) VALUES (?,?,?,?)',
    [this.title, this.price, this.imageUrl, this.description]);
  }

  static deleteById(id){
    
  }

  // fetcing all items
  static fetchAll() {
    return db.execute('SELECT * FROM products');
  }

  static findById(id){
    return db.execute('SELECT * FROM products WHERE products.id = ?',
    [id])
  }
};
