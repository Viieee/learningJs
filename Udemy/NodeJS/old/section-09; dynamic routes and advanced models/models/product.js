const fs = require('fs');
const path = require('path');

// importing cart
const Cart = require('./cart');

const p = path.join(
  path.dirname(require.main.filename),
  'data',
  'products.json'
);


const getProductsFromFile = cb => {
  fs.readFile(p, (err, fileContent) => {
    if (err) {
      cb([]);
    } else {
      cb(JSON.parse(fileContent));
    }
  });
};

module.exports = class Product {
  constructor(id, title, imageUrl, description, price) {
    this.id = id;
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
  }

  save() {
    getProductsFromFile(products => {
      if (this.id){ // if the id is present, that means we want to edit existing item
        // looking for the index of the product being edited
        const existingProductIndex = products.findIndex(prod=>{
          if(prod.id === this.id){
            return prod;
          }
        });
        // recreating the product array
        const updatedProducts = [...products];
        // replacing the product's in the index we searched in existingProductIndex
        // with the new one
        updatedProducts[existingProductIndex] = this;
        // replacing the old file
        fs.writeFile(p, JSON.stringify(updatedProducts), err => {
          console.log(err);
        });
      }else{ // adding new product
        // adding id to the object before being pushed into the array
        // this id will be passed into each individual product in ejs so we can edit it later
        this.id = Math.random().toString();
        products.push(this);
        // replacing the old file
        fs.writeFile(p, JSON.stringify(products), err => {
          console.log(err);
        });
      }
    });
  }

  // deleting the product from the list
  static deleteById(id){
    // getting all the products
    getProductsFromFile(products=>{
      const product = products.find(prod=>{
        if(prod.id===id){
          return prod
        }
      })
      // the other way to do it is to filter the array
      // we want to keep all the product that don't have the same id as the
      // product we passed into this method
      const updatedProducts = products.filter(prod=>{
        if(prod.id !== id){
          // returning all the product that dont have the same id
          return prod;
        }
      });
      // rewriting the file, but filling it with the filtered products
      fs.writeFile(p, JSON.stringify(updatedProducts), err=>{
        if(!err){
          // if the item is deleted from the list,
          // it should be deleted from cart too!
          Cart.deleteProduct(id, product.price);
        }
        console.log(err);
      })
    })
  }


  static fetchAll(cb) {
    getProductsFromFile(cb);
  }

  static findById(id, cb){
    // the main goal of this static method is to filter the product based on the id passed into it
    // and later this function will execute the callback function and passing the filtered product to that callback function
   
    getProductsFromFile(products =>{  // products retrieved from the returned value of the getProductsFromFile function
                                      // parsed from JSON into array
      // filtering the product based on id
      const product = products.find(prod=>{
        if (prod.id === id){
          return prod; // filtered product
        }
      });
      // executing callback function and passing the filtered product into it
      cb(product);
    })
  }
};
