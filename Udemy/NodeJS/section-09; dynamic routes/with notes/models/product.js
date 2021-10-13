const fs = require("fs");
const path = require("path");
const Cart = require("./cart");

const p = path.join(
  path.dirname(require.main.filename),
  "data",
  "products.json"
);
/* 
   ! path.dirname(require.main.filename) is a path to the root folder
   ? p is the path to the product file
   ? the products.json file will contain an array from the products array 
*/

const getProductsFromFile = (cb) => {
  fs.readFile(p, (err, fileContent) => {
    // ! this readFile() method will throw an error if the file doesn't exist yet
    if (err) {
      // if the file doesn't exist, return an empty array to the callback function and execute the function
      cb([]);
    } else {
      // if the file does exist, return the parsed data and pass it into the callback function and execute the function
      cb(JSON.parse(fileContent));
    }
  });
};

module.exports = class Product {
  constructor(id, title, imageUrl, description, price) {
    /*  
          ! this.title is the variable in this class, it will reflect the argument
          ! passed onto it when initializing the class
    */
    this.id = id;
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
  }

  save() {
    /* 
      ? flow of this function:
      1. fetch every product in product.json file 
         !(products returning an array of objects)
        if edit product (this.id present in the instantiated object):
      2. looking for the index of the product on the products array based on the this.id provided
      3. recreating the existing products array fetched from step #1
      4. replacing the specific product in the index for the instantiated object
      5. replace the old file with new value
        if add new product :
      2. making id for the new instantiated object 
      3. appending the instantiated object to the products array
      4. rewriting the old file with new value
    */

    // fetch every product in product.json file
    getProductsFromFile((products) => {
      if (this.id) {
        // ! this if statement will trigger if the object contains id, that means we want to do edit operation
        /* 
          because products is basically an array of objects
          "products": [{}]
          we want to look for the index of the instantiated object based on the provided id
        */
        const existingProductIndex = products.findIndex((prod) => {
          if (prod.id === this.id) {
            return prod; // ! this will return the index of the product in the products array
          }
        });

        // recreating the product array
        const updatedProducts = [...products];

        // replacing the product on the exact index position with the instatiated object
        updatedProducts[existingProductIndex] = this;

        // replacing the old file with new recreated array as the value
        fs.writeFile(p, JSON.stringify(updatedProducts), (err) => {
          console.log(err);
        });
      } else {
        // ! this code will run if the id of the instantiated object doesn't exist, that means we want to add new product
        this.id = Math.random().toString(); // making id for the new product
        // pushing the object (appending it to the products array) created with this class instantiation
        products.push(this);
        fs.writeFile(p, JSON.stringify(products), (err) => {
          console.log(err);
        });
      }
    });
  }

  static fetchAll(cb) {
    /* 
            ! cb in fetchAll parameter is a callback function
            ? a callback function is a function that can be 
        */
    getProductsFromFile(cb);
  }
  /* 
        ! static means that this method will be able to be called directly on the class itself, and not on an instantiated object
        example :
        const Product = require("../models/product");

        Product.fetchAll(cb(){
            ....
        })
    */

  static deleteById(id) {
    /* 
      ! this method recieves the id of the product we want to delete
      ? we want to delete the item from the cart.json file by filtering it based on the id
    */
    getProductsFromFile((products) => {
      // finding the product in products array
      const product = products.find(prod=>{
        if(prod.id===id){
          return prod
        }
      })
      const updatedProducts = products.filter((prod) => {
        if (prod.id !== id) {
          // ! every item that DOESN'T match the id will be returned
          return prod;
        }
      });
      
      // rewriting the products.json file with new values
      fs.writeFile(p, JSON.stringify(updatedProducts), (err) => {
        // deleting the product from the cart too
        if(!err){
          Cart.deleteProduct(id, product.price)
        }
        console.log(err);
      });
    });
  }

  static findById(id, cb) {
    // ! the main goal of this static method is to filter the product based on the id passed into it
    // ! and later this function will execute the callback function and passing the filtered product to that callback function

    getProductsFromFile((products) => {
      /* 
        ? products is an array of objects
      */
      const product = products.find((p) => {
        if (p.id === id) {
          return p;
          // ? p is the filtered value that has matched id
        }
      });

      // executing the callback function with the filtered product as the argument
      cb(product);
    });
  }
};
