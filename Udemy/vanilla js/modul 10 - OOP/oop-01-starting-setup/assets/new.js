const DIV_ID_BODY = 'app';

// contain product data 
class Product{
    constructor(name, image, price, desc){
        this.prodName = name;
        this.imageUrl = image;
        this.prodPrice = price;
        this.prodDesc = desc;
        // prodName, imageUrl, prodPrice, dan prodDesc adalah property baru
        // yang dibuat di constructor.
        // name, image, price, dan desc adalah parameter yang diambil saat instansiasi class ini
    }
}

// for the attribute parameter in buatElementBaru method
class ElementAttribute{
    constructor(attrName, attrValue){
        this.attribute = attrName;
        this.value = attrValue;
        // creating new properties called attribute and value
        // and getting the value through instantiation of the class
    }
}

// parent class, implementing inheritance.
class ParentClass{
    constructor(elementId){
        this.elId = elementId;
        // creating new property called elId, recieving new data in the form of id
        // the id will be passed on through super() on child classes.
    }

    // method to make new element dynamically with parameters
    buatElementBaru(htmlTag, cssClass, attributes){
        // htmlTag is the html tag in function argument 
        // cssClass is the class name of the new element created in this class
        // attributes is an array of object with ElementAttribute class as the skeleton,
        // with attributes and value. We will set this with ElementAttribute class
       
        const newElement = document.createElement(htmlTag);
        if(cssClass){
            newElement.className = cssClass;
            // if cssClass argument exist, set the class name to cssClass parameter
        }
        if(attributes && attributes.length > 0){
            for(const attr of attributes){
                newElement.setAttribute(attr.attribute,attr.value);
                // setting attribute on new element that just being created
            }
        }
        document.getElementById(this.elId).append(newElement);
        // appending the new element into the element that already exist

        return newElement;
        // returning the new element created so that it can be stored in a variable 
        // and manipulated later in other class
    }
}


// rendering per-products
class ProductItem extends ParentClass{
    constructor(product, elId){
        super(elId);
        this.product = product;
        // passing the elId that we get from instantiation of this class into parent class
        // and we will create new property called product, the data passed on from instantiation of this class
    }


    // button handler function
    addToCartHandler(){
        console.log(`Adding ${this.product.prodName} to cart!`); 
        App.addProductToCart(this.product);
        // addProductToCart will execute addProduct method in ShoppingCart class
        // and passing this.product as the argument
        // this.product is an object
    }

    render(){
        const liNew = this.buatElementBaru('li','product-item');
        // create new li element using buatElementBaru method in parent class
        // with product-item as the class name (for styling)
        
        liNew.innerHTML = `
            <div>
                <img src="${this.product.imageUrl}" alt="${this.product.prodName}">
                <div class='product-item__content'>
                    <h2>${this.product.prodName}</h2>
                    <h3>\$${this.product.prodPrice}</h3>
                    <p>${this.product.prodDesc}</p>
                    <button>Add to Cart</button>
                </div>
            </div>
        `;
        // this.product referring to the property created in constructor

        const addCartButton = liNew.querySelector('button');
        addCartButton.addEventListener('click', this.addToCartHandler.bind(this));
        // this inside bind argument will directing the focus of the addToCartHandler into this class
        // so that the this referenced in the addToCartHandler function is ProductItem class
    }

}


// storing all product data
class ProductList extends ParentClass{
    products = [
        new Product(
        'GOLF Le Fleur Lacoste Teddy Jacket Green',
        'https://images.stockx.com/products/streetwear/GOLF-Le-Fleur-Lacoste-Teddy-Jacket-Green.png?fit=fill&bg=FFFFFF&w=700&h=500&auto=format,compress&q=90&trim=color&updated_at=1603481985&w=1000',
        800,
        'Golf le fleur collab with lacoste'), //memanggil class
        new Product(
        'Golf le fleur x Converse Gianno Ox Vintage White',
        'https://process.fs.grailed.com/AJdAgnqCST4iPtnUxiGtTz/auto_image/cache=expiry:max/rotate=deg:exif/resize=height:700/output=quality:70/compress/https://cdn.fs.grailed.com/api/file/e8J1lYUAQRq9S3x2vgwB',
        220,
        'Converse collab with golf le fleur'), //memanggil class
        new Product(
        'Golf le fleur x Converse Chuck taylor 70s High White',
        'https://stockx-360.imgix.net/Converse-Chuck-Taylor-All-Star-70s-Hi-Golf-Le-Fleur-Parchment/Images/Converse-Chuck-Taylor-All-Star-70s-Hi-Golf-Le-Fleur-Parchment/Lv2/img01.jpg?auto=format,compress&q=90&updated_at=1607672662&w=1000',
        200,
        'Converse collab with golf le fleur')
    ];

    constructor(elId){
        super(elId);
        // elId is the data inserted as argument when instantiating this class
        // and this will be passed onto the parent class
    }

    render(){
        const ulNew = this.buatElementBaru('ul',
                                           'product-list',
                                           [new ElementAttribute('id','prod-list')]);
        // creating new ul element with buatElementBaru method in ParentClass class
        // with classname of productlist (for styling) and id of prod-list

        for(const prod of this.products){
            const productItem = new ProductItem(prod,'prod-list');
            productItem.render();
            // instantiating ProductItem class, passing prod as the item processed inside ProductItem class 
            // and passing prod-list as the value into the parent class later
            // prod-list is the id of the new ul element created in this class
        }
    }
}

class ShoppingCart extends ParentClass{
    // this class will be executed everytime an item added into the cart
    // each item is an array

    // group all items added into cart into one
    items = [];

    // making a property that the value can be changed
    set cartItems(value){
        this.items = value;
        this.totalOutput.innerHTML=`
            <h2>Total \$${this.totalAmount}</h2>
        `;
        // setting new editable property called cartItems
        // every value set into this property will be passed into items property
    }

    // making a property that can only be access and not edited the value of
    get totalAmount(){
        const sum = this.items.reduce(function(previousValue, currentItem){
            return previousValue + currentItem.prodPrice;
        },0);
        return sum;
        // making the total sum of price from all previously selected items and the current selected item
    }

    constructor(elId){
        super(elId);
    }

    addProducts(product){
        const updatedItems = [...this.items];
        updatedItems.push(product);
        this.cartItems = updatedItems;
        // copying array in items and inserting new value to the new array
        // the new value from parameter will be an object
        // after that setting the value of the old array and copying the value into it through set cartItems

    }

    render(){
        const cartElement = this.buatElementBaru('section','cart');
        // creating new section element with cart as the class name
        
        cartElement.innerHTML = `
            <h2>Total: \$${0}</h2>
            <button>Order Now!</button>
        `;

        const cartButton = cartElement.querySelector('button');
        this.totalOutput = cartElement.querySelector('h2');
        // storing the newElement into a property called totalOutput
    }
}

class Shop{
    cart;

    render(){
        this.cart = new ShoppingCart (DIV_ID_BODY);
        // instantiating ShoppingCart class and giving the value of 'app' to the parent class

        const productList = new ProductList(DIV_ID_BODY);
        // instantiating ProductList class and giving the value of 'app' to the parent class

        this.cart.render();

        productList.render();
    }
}


// static class
class App{
    // the main function of this class is to glue all the classes together

    static cart; // static property

    static init(){ // static method 
        const shop = new Shop();
        shop.render();

        this.cart = shop.cart
        // this.cart is referring to the static property in this class
        // shop.cart is reffering to the cart in shop class
        // the cart in Shop class is an instantiation of shopping cart class
        // making it possible to use method in shopping cart class
    }

    static addProductToCart(product){
        this.cart.addProducts(product);
        // this function will be called when the add to cart button is clicked and 
        // an item is added into cart
    }
}

// executing method static
App.init();