// cookies

// accessing the cookie
// document.cookie // accessed to all cookie data stored


// buttons
const storeBtn = document.getElementById('store-btn');
const retrBtn = document.getElementById('retrieve-btn');

// event listeners
storeBtn.addEventListener('click', ()=>{
    const userId = 'u123';
    const user = {
        name: 'Vieri',
        age: 21
    }
    // adding new entry to the cookie
    document.cookie = `userId=${userId}; max-age=10`;// uid is the key, userId is the value
                                    // no white space before the equal sign 
                                    // this won't clear or override the existing cookie
                                    // it will only replace a cookie that has the same key as the existing cookie
    document.cookie = `user=${JSON.stringify(user)}`;
    document.cookie = `extra=extradata`;
})

retrBtn.addEventListener('click', ()=>{
    // reading the cookie
    console.log(document.cookie); // this way of reading cookie will only return a long string 
                                 // and won't separate the data on it's own value per key
                                 // output : uid=u123; user={"name":"Vieri","age":21}
    
    // way to make it nicer and workable
    const cookieData = document.cookie.split(';'); // returning array based on the long string
                                                   // but this split method will leave excess whitespace infront of the 
                                                   // 2nd and further data
    console.log(cookieData); // output : array(2)
                             // [0] : "uid=u123"
                             // [1] : " user{"name": "Vieri", "age": 21}"
    
    // how to remove the excess whitespace
    const data = cookieData.map(i=>{
        // map method is used to recreate an array an calling a function on every element inside of the array
        return i.trim(); // trim will remove excess whitespace infront and in the back of value
    });
    console.log(data); 

    // how to access key and value separately
    console.log(data[1].split('=')[1]); // we access the value indexed 1(2nd value in the array)
                                        // then we separate the key and value into their separate values with '=' and we omit the '='
                                        // turning it into an array and assigning each value into the array
                                        // then we accessed the index 1 data in the array

    // #NOTE:
    // advantage of a cookie is that you can set them to expire and 
    // send the to a server with request
})