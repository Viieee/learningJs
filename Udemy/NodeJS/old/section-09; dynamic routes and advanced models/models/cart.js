// global module, dependencies
const fs = require('fs');
const path = require('path');

// path we want of the cart file
// the file will contain all data of items we added into cart
const p = path.join(
    path.dirname(require.main.filename),
    'data',
    'cart.json'
);
  

module.exports = class Cart {

    // add/remove product
    static addProduct(id, productPrice){
        // fetch previous cart
            // read file, checking whether the file exsited or not
        fs.readFile(p, (err, fileContent)=>{
            // the default object of the cart
            let cart = {products: [], totalPrice: 0}
            // later the products array will contain object of products 
            // that object of products contain the id of the product and the quantity of the product

            if(!err){
                // if the file exist, that means we already have a file
                // formatted in JSON, so we need to parse it back into
                // data type js can work with (in this case an object)
                cart = JSON.parse(fileContent);
            }
            // analyze the cart => find existing product in cart
                // checking whether the item we just added to the cart already added or not
                // based on the id of the product
            const existingProductIndex = cart.products.findIndex(prod=>{
                // this function will loop through all items in the products array
                // and each item is represented by 'prod'
                if(prod.id === id){
                    return prod; 
                    // this wont return the product, just the index of the product.
                    // if the cart is empty, then it will returned -1
                }
            });
            // we filter a product based on the index
            // if the cart is empty, this will be undefined
            // because theres no array number -1
            // and undefined is a falsy value
            const existingProduct = cart.products[existingProductIndex];

            let updatedProduct; // this variable will store the products object

            // add new product/increase quantity
            if(existingProduct){
                // if the cart is filled with a product 
                // and we adding the same product again

                    // remaking product object based on the existing product
                updatedProduct = {...existingProduct};
                    // adding the quantity of the product that already in the cart
                updatedProduct.qty = updatedProduct.qty+1;
                    // editing the old value inside of our product array with the new one
                    // in updatedProduct
                cart.products[existingProductIndex] = updatedProduct;
            }else{
                // storing the updatedProduct with id 
                // and the quantity of one (because it's the first time it's been added to cart)
                updatedProduct = {
                    id: id,
                    qty: 1
                };
                // adding new product into cart
                    // you can do it like this or with push method
                cart.products = [...cart.products, updatedProduct];
                // cart.products.push(updatedProduct)
            }
            // editing the totalPrice key in cart object
            // + infront of productPrice means that we converting it into number
            cart.totalPrice = cart.totalPrice + +productPrice;
            // writing the file based on the cart object
            fs.writeFile(p, JSON.stringify(cart), err=>{
                console.log(err)
            })
        })
    }

    // deleting the product from the cart
    static deleteProduct(id, productPrice){
        // read the cart file
        fs.readFile(p, (err, fileContent)=>{
            if(err){
                // if theres nothing on the cart, don't do anything.
                return;
            }
            // updating the cart
            const updatedCart = {...JSON.parse(fileContent)};
            // finding out how much of the product we have in the cart
            const product = updatedCart.products.find(prod=>{
                if(prod.id===id){
                    return prod;
                }
            });

            // if product that wanted to be deleted doesn't exist in cart
            // because in product admin, we will execute this deleteProduct function too!
            if(!product){
                return;
            }

            const productQty = product.qty;
            updatedCart.products = updatedCart.products.filter(prod=>{
                if(prod.id !== id){
                    return prod;
                }
            })
            // decreasing cart total price
            updatedCart.totalPrice = updatedCart.totalPrice - productPrice * productQty;

            fs.writeFile(p, JSON.stringify(updatedCart), err=>{
                console.log(err)
            })
        })
    }

    // getting all products in the cart
    static getProductsInCart(cb){
        fs.readFile(p, (err, fileContent)=>{
            const cart = JSON.parse(fileContent)
            // check if we have a cart yet or not
            if(err){
                cb(null);
            }else{
                cb(cart);
            }
        });
    }
}