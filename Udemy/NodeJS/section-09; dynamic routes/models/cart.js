const fs = require("fs");
const path = require("path");

const p = path.join(path.dirname(require.main.filename), "data", "cart.json");

module.exports = class Cart {
  static addProduct(id, productPrice) {
    fs.readFile(p, (err, fileContent) => {
      let cart = { products: [], totalPrice: 0 };
      if (!err) {
        cart = JSON.parse(fileContent);
      }
      const existingProductIndex = cart.products.findIndex((prod) => {
        if (prod.id === id) {
          return prod;
        }
      });
      const existingProduct = cart.products[existingProductIndex];

      let updatedProduct; 

      if (existingProduct) {

        updatedProduct = { ...existingProduct };

        updatedProduct.qty = updatedProduct.qty + 1;

        cart.products[existingProductIndex] = updatedProduct;
      } else {
        updatedProduct = {
          id: id,
          qty: 1,
        };
        cart.products.push(updatedProduct);
        console.log("updated products in cart", cart.products);
      }
      cart.totalPrice = cart.totalPrice + +productPrice;

      fs.writeFile(p, JSON.stringify(cart), (err) => {
        console.log(err);
      });
    });
  }

  static deleteProduct(id, productPrice) {

    fs.readFile(p, (err, fileContent) => {
      if (err) {

        return;
      }

      const updatedCart = { ...JSON.parse(fileContent) };

      const product = updatedCart.products.find((prod) => {
        if (prod.id === id) {
          return prod;
        }
      });

      if (!product) {
        return;
      }

      const productQty = product.qty;

      updatedCart.products = updatedCart.products.filter((prod) => {
        if (prod.id !== id) {
          return prod;
        }
      });

      updatedCart.totalPrice =
        updatedCart.totalPrice - productPrice * productQty;

      fs.writeFile(p, JSON.stringify(updatedCart), (err) => {
        console.log(err);
      });
    });
  }

  static getProductsInCart(cb) {
    fs.readFile(p, (err, fileContent) => {
      const cart = JSON.parse(fileContent);
      if (err) {
        cb(null);
      } else {
        cb(cart);
      }
    });
  }
};
