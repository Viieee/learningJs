const fs = require('fs');
const path = require('path');

// the path we want to save the file in
// the file will contain all the data
const p = path.join(
  path.dirname(require.main.filename),
  'data',
  'products.json'
);

const getProductsFromFile = cb => {
  // we want to run read file operation first
  // then we execute the callback function

  // reading the file and checking whether it already exist or not
  fs.readFile(p, (err, fileContent) => {
    if (err) {
      // if it doesn't, it will return an error
      // and we will execute the callback function with an empty array as the argument
      cb([]);
    } else {
      // if the file does exist
      // we will execute the callback function and passing a parsed data into it as the argument
      cb(JSON.parse(fileContent));
    }
  });
};

module.exports = class Product {

  constructor(title, imageUrl, description, price) {
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
  }

  save() {
    getProductsFromFile(products => { // the products parameter is passed on from the getProductsFromFile
                                      // it's either an empty array if the file doesn't exist yet
                                      // or it will passed in all the parsed data in form of an array
      // pushing the object created in this class into the product array
      products.push(this);
      // console.log(this);

      // write the file if the file doens't exist yet
      // rewrite the file if it already exsited
      fs.writeFile(p, JSON.stringify(products), err => {
        console.log(err);
      });
    });
  }

  // fecting all the data
  static fetchAll(cb) {
    // passing the callback function recieved from initialization 
    // into getProductsFromFile function
    getProductsFromFile(cb);
  }
};