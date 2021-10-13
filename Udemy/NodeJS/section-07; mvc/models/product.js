const fs = require('fs');
const path = require('path');

module.exports = class Product {
    constructor(t){
        /*  
          ! this.title is the variable in this class, it will reflect the argument
          ! passed onto it when initializing the class
        */
        this.title = t
    }

    save(){
        const p = path.join(path.dirname(require.main.filename), 'data', 'products.json');
        /* 
            ! path.dirname(require.main.filename) is a path to the root folder
            ? p is the path to the product file
        */
       
        
        fs.readFile(p, (err, data)=>{
            // ! this readFile() method will throw an error if the file doesn't exist yet
            let products = [];
            if(!err){
                // ! this part of code only runs then the file already existed

                // parsing the data recieved and storing it to products array
                products = JSON.parse(data);
                console.log('parsed data' , products)
            }
            // pushing the object (appending it to the products array) created with this class instantiation
            products.push(this);
            console.log('modified data' , products)
            fs.writeFile(p, JSON.stringify(products), err=> {
                console.log(err);
            });
            /* 
                the products.json file will contain an array from the products array 
                the writeFile() method will replaced the existing file with the new file with modified value

            */
        })


    }

    static fetchAll(cb){
        /* 
            ! cb in fetchAll parameter is a callback function
            ? a callback function is a function that can be 
        */
        const p = path.join(path.dirname(require.main.filename), 'data', 'products.json') 
        fs.readFile(p, (err, data)=>{
            if(err){
                // if the file doesn't exist, return an empty array to the callback function and execute the function
                cb([]);
            }else{
                // if the file does exist, return the parsed data and pass it into the callback function and execute the function
                cb(JSON.parse(data));
            }
        })
    }
    /* 
        ! static means that this method will be able to be called directly on the class itself, and not on an instantiated object
        example :
        const Product = require("../models/product");

        Product.fetchAll(cb(){
            ....
        })
    */


}