// indexedDB

// open a connection/create a db
const dbReq = indexedDB.open('dbTest', 1); // 1st argument can be anything, this will be the name of the db
                                            // 2nd argument is the version of the db
                                            // the open() method return a db request
let db; 

dbReq.onsuccess = function(event){
    // fired when the result of a request is successfully returned.
    // in other words, when the script reruns or whenever the database connection
    // is already opened
    
    db = event.target.result; // holding access to the database
}

// dbReq.onsuccess = function(event){
dbReq.onupgradeneeded = function(event){
    // onupgradeneeded will run whenever the database is created for the first time or
    // when the version number changes

    // access to database we connected/ we just created through event object (the parameter)
    db = event.target.result; // holding access to the database

    // you working with object store in indexedDB
    // you can have multiple object stores and each object store can store multiple objects

    // configuring it, create object store
    const objStore = db.createObjectStore('products', {keyPath: 'id'});  // keyPath is a must!, the value can be whatever you want
    // 1st argument is the name of the object store
    // 2nd argument contains key, one property that exists on every stored object/item
        // by which this object/item can be identified
    
    objStore.transaction.oncomplete = function(event){
        // oncomplete will trigger once the object store creation finished

        // object store access
        const productsStore = db.transaction('products', 'readwrite').objectStore('products');
        
        productsStore.add({
            id: 'p1', // the key of this is the value in keyPath above
            title: 'first product',
            price: 10
        }) // taking object as the argument, needs to have the key we store in the keyPath
    }
}

dbReq.onerror = function(event){
    console.log('error!');
}

// buttons
const storeBtn = document.getElementById('store-btn');
const retrBtn = document.getElementById('retrieve-btn');

// event listeners
storeBtn.addEventListener('click', ()=>{
    const productsStore = db.transaction('products', 'readwrite').objectStore('products');
        
    productsStore.add({
        id: 'p2', // the key of this is the value in keyPath above
        title: 'second product',
        price: 20
    }) 
})

retrBtn.addEventListener('click', ()=>{
    const productsStore = db.transaction('products', 'readwrite').objectStore('products');

    const request = productsStore.get('p2');

    request.onsuccess = function (){
        console.log(request.result);
    }
})