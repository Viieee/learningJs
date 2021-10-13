const listElement = document.querySelector('.posts') // ul element
const postTemplate = document.getElementById('single-post') // template element
const form = document.querySelector('#new-post form'); // selecting form element inside a parent node with new-post as the id
const fetchButton = document.querySelector('#available-posts button');
const postList = document.querySelector('ul');


function sendHttpRequest(method, url, data){
    // // data parameter is optional (in this case for the post method)

    // const promise = new Promise((resolve, reject)=>{
    //     // http request require XMLHttpRequest object
        // const xhr = new XMLHttpRequest();
        
    //     // configuring the http object
    //     xhr.open(method, url); // first step
        
    //     // pre-configuring the response (parsing the response) into js objects/arrays
    //     xhr.responseType = 'json'
        
    //     // event listener using on load (alternative to addEventListener because using it in XMLHttpRequest object is not supported in some browser)
    //     xhr.onload = function(){
    //         // this function will handle upcoming responses

    //         if(xhr.status >= 200 && xhr.status < 300){
    //             resolve(xhr.response);
    //         }else{
    //             reject(new Error('Something went wrong!'));
    //         }

    //         // extracting the response
    //         // console.log(xhr.response) // this is the response fetched from the server (in form of JSON data as the default)
            
    //         // converting the JSON data into js objects and arrays with JSON helper method parse()
    //         // const listOfPosts = JSON.parse(xhr.response);
    //         // console.log(listOfPosts)
    //     }

    //     xhr.onerror = function(){
    //         // if we fail to send the request
    //         // e.g network failure
    //         reject(new Error('Something went wrong!'));
    //     }

    //     xhr.send(JSON.stringify(data)); // sending the request

    //     });
    // return promise;

    return fetch(url, {
        method: method, // default is GET
        body: JSON.stringify(data), // converting the data into json
        headers: {
            'Content-Type': 'application/json' // a way to tell the server that the data sent with the request is a json data
        }
    }).then(response=>{
        if(response.status>=200&&response.status<300){

            return response.json().then(data=>console.log(data)); // the data is a json object
                                    // the json method will parse and convert the body of the response
                                    // and transform it from json into js objects and arrays
                                    // it's not just a replacement for JSON.parse() method, because
                                    // it also turns the streamed response body (which you have in the response object)
                                    // into a snapshot
        }else{
            return response.json().then(errorData => {
                // response.json() will turn the response from streamed response into a snapshot
                // and then turn the response (in json) into js objects/arrays

                // accessing the body of error response
                console.log(errorData);
                throw new Error('Something went wrong - Server side.');
            })
        }
    }).catch(error=>{
        // error handler 
        console.log(error);
        throw new Error('Something went wrong!');
    })
 
}

// fetching data using promise only
// function fetchPosts(){
//     sendHttpRequest('GET', 'https://jsonplaceholder.typicode.com/posts')
//     .then((responseData) =>{
//         const listOfPosts = responseData;
//         // inserting the response into list item on the template element
//         for(const post of listOfPosts){
//             const postEl = document.importNode(postTemplate.content, true); // cloning the content of the template element, so in this case the li element
//             console.log(postTemplate.content);
//             postEl.querySelector('h2').textContent = post.title.toUpperCase();
//             postEl.querySelector('p').textContent = post.body;
    
//             // appending the element inside of the template into the ul element
//             listElement.append(postEl);
//         }
//     })
// }

// fetching data using promise + async await 
async function fetchPosts(){
    try{
        const responseData = await sendHttpRequest('GET', 'https://jsonplaceholder.typicode.com/posts');

        const listOfPosts = responseData;

        // inserting the response into list item on the template element
        for(const post of listOfPosts){
            const postEl = document.importNode(postTemplate.content, true); // cloning the content of the template element, so in this case the li element
            // console.log(postTemplate.content);
            postEl.querySelector('h2').textContent = post.title.toUpperCase();
            postEl.querySelector('p').textContent = post.body;

            // adding id attribute into the li button (for deletion purposes)
            postEl.querySelector('li').id = post.id;

            // appending the element inside of the template into the ul element
            listElement.append(postEl);
        }
    }
    catch(e){
        alert(e.message);
    }
}

async function createPost(title, content){
    const userId = Math.random(); 
    // post object
    const post = {
        title: title,
        body: content,
        userId: userId // naming of this property is caused by the naming requirement of the API i'm using 
                      // to learn about this topic, it's called jsonplaceholder.typicode.com
    }

    sendHttpRequest('POST','https://jsonplaceholder.typicode.com/posts', post);

}

// createPost('CONTOH', 'baru nih hehehehe');

// event listener
fetchButton.addEventListener('click', ()=>{
    fetchPosts();
});

form.addEventListener('submit', event => {
    event.preventDefault(); // preventing the default behaviour of the form element which is reloading the page when the form is being sumbitted
    const enteredTitle = event.currentTarget.querySelector('#title').value;
    const enteredContent = event.currentTarget.querySelector('#content').value;

    createPost(enteredTitle, enteredContent);
})


// event handler delegation (1 event handler planted into the parent node) to handle multiple event on multiple child nodes
postList.addEventListener('click', event =>{
    if(event.target.tagName === 'BUTTON'){
        // console.log('clicked on a button');
        const postId = event.target.closest('li').id; // storing the id of the li element
        // console.log(postId);
        sendHttpRequest('DELETE',`https://jsonplaceholder.typicode.com/posts/${postId}`);
    }
})