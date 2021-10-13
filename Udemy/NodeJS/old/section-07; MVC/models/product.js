// const products = [];

const fs = require('fs');
const path = require('path');

module.exports = class Product{
    constructor(title){
        this.title = title;
    }

    save(){
        // products.push(this);

        // saving it in a file
        const p = path.join(path.dirname(require.main.filename), 'data', 'products.json') 
        // path.dirname(require.main.filename) is a path to the root folder

        // reading the file, whether they're exist or not
        fs.readFile(p, (err, data)=>{
            console.log(data);
            let products = [];
            if(!err){
                // if the file existed
                // the products array will be filled with data in the file
                products=JSON.parse(data);
            }
            // pushing new product object created with this class
            // this will either create new file and pushing the object in
            // or appending the new object into existing file data that 
            // is now stored in the product array because we parsed it in the if check above 
            products.push(this);
            // storing it to the file
            fs.writeFile(p, JSON.stringify(products), err =>{
                console.log(err);
            });
        });
        // storing 
    }

    // fetching all products
    static fetchAll(cb){
        const p = path.join(path.dirname(require.main.filename), 'data', 'products.json') 
        fs.readFile(p, (err, data)=>{
            if(err){
                cb([]);
            }else{
                cb(JSON.parse(data)); // returning data
            }
        })
    }
}