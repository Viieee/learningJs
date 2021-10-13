const products = [];

module.exports = class Product {
    constructor(t){
        /*  
          ! this.title is the variable in this class, it will reflect the argument
          ! passed onto it when initializing the class
        */
        this.title = t
    }

    save(){
        // this refers to the object created based on this class
        products.push(this)
    }

    static fetchAll(){
        // ! we want this method to return an array of the products
        return products;
    }
    // static means that this method will be able to be called directly on the class itself, and not on an instantiated object


}