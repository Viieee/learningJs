const fs = require("fs");
const path = require("path");

const p = path.join(path.dirname(require.main.filename), "data", "cart.json");
/* 
   ! path.dirname(require.main.filename) is a path to the root folder
   ? p is the path to the product file
   ? the cart.json file will contain an array from the products array in cart
*/

module.exports = class Cart {
  static addProduct(id, productPrice) {
    /* 
            we want to:
            1. fetch the previous cart
            2. analyze if the product already exist in the cart
            3. add new product/increase the quantity
        */

    // fetch the previous cart
    fs.readFile(p, (err, fileContent) => {
      let cart = { products: [], totalPrice: 0 }; // default object of the cart
      /* 
        ? the product will be an array of objects with id and quantity as the properties
        products: [{"id": "????", qty: 0}] 
      */

      if (!err) {
        // ! this if statement will execute if the cart.json already exist
        cart = JSON.parse(fileContent);
      }

      // analyze if the product already exist in the cart
      // ! we want to look for the index of the product in the array first
      // ? the reason why we want to find the index of the product in the products array is because later on, we want to update the product in the cart
      // ? in case the product is already exist in the cart
      const existingProductIndex = cart.products.findIndex((prod) => {
        if (prod.id === id) {
          return prod; // it will return the index of the product in the products array
          /* 
            this function will loop through all items in the products array
            and each item is represented by 'prod'
            if the id is matched, existingProduct will contain the index of the product with matched id
          */
        }
      });

      // ! the product is an object
      const existingProduct = cart.products[existingProductIndex]; // storing the filtered product using index

      let updatedProduct; // this variable will store the products object

      if (existingProduct) {
        /* 
            this if statement will triger if the existing product does contain some value
            that means the product is already exist in the cart hence we want to increase the quantity of the product in the cart
          */

        // remaking the
        updatedProduct = { ...existingProduct };

        updatedProduct.qty = updatedProduct.qty + 1;

        cart.products[existingProductIndex] = updatedProduct;
      } else {
        // ! this else statement will be executed if the product is new on the cart
        // storing the product
        updatedProduct = {
          id: id,
          qty: 1,
        };

        // appending the new product into the products array in cart object
        cart.products.push(updatedProduct);
        console.log("updated products in cart", cart.products);
      }
      // editing the totalPrice
      cart.totalPrice = cart.totalPrice + +productPrice; // ! + infront of productPrice will convert it to number

      // writing the file based on the cart object
      fs.writeFile(p, JSON.stringify(cart), (err) => {
        console.log(err);
      });
    });
  }

  // deleting product from cart
  static deleteProduct(id, productPrice) {
    // read the cart file
    fs.readFile(p, (err, fileContent) => {
      if (err) {
        // if theres nothing on the cart, don't do anything.
        return;
      }
      // recreating the cart object
      const updatedCart = { ...JSON.parse(fileContent) };
      // finding the existence of the product in the cart
      const product = updatedCart.products.find((prod) => {
        if (prod.id === id) {
          // ! will return the exact product with the matched id
          return prod;
        }
      });

      if (!product) {
        // if the product doesn't exist in the cart then dont do anything
        return;
      }

      // storing the quantity of the product
      const productQty = product.qty;

      // updating the products array property in cart object
      updatedCart.products = updatedCart.products.filter((prod) => {
        if (prod.id !== id) {
          // ! every item that DOESN'T match the id will be returned
          return prod;
        }
      });

      // decreasing the total price in cart object
      updatedCart.totalPrice =
        updatedCart.totalPrice - productPrice * productQty;

      // rewriting the file with new value
      fs.writeFile(p, JSON.stringify(updatedCart), (err) => {
        console.log(err);
      });
    });
  }

  // getting all products in the cart
  static getProductsInCart(cb) {
    fs.readFile(p, (err, fileContent) => {
      const cart = JSON.parse(fileContent);
      // check if we have a cart yet or not
      if (err) {
        cb(null);
      } else {
        cb(cart);
      }
    });
  }
};
