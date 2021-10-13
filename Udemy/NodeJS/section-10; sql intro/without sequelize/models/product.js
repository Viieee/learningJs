const Cart = require("./cart");

// importing the connection pool
const db = require("../util/database");

module.exports = class Product {
  constructor(id, title, imageUrl, description, price) {
    this.id = id;
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
  }

  save() {
    return db.execute(
      "INSERT INTO products (title, imageUrl, description, price) VALUES (?, ?, ?, ?)",
      [this.title, this.imageUrl, this.description, this.price]
    ); // ! this will return a promise
  }

  static fetchAll() {
    return db.execute("SELECT * FROM products"); // ! this will return a promise
  }

  static deleteById(id) {}

  static findById(id) {
    return db.execute("SELECT * FROM products WHERE products.id = ?", [id])
  }
};
