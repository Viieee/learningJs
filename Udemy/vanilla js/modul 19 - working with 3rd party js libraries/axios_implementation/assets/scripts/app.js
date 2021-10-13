// this project is based on the project i practiced in module 18
// so for the detail explanation and some alternative ways you can check that module instead
// the project in this module will be focusing on utilizing the axios library on sending http request


const listElement = document.querySelector('.posts') // ul element
const postTemplate = document.getElementById('single-post') // template element
const form = document.querySelector('#new-post form'); // selecting form element inside a parent node with new-post as the id
const fetchButton = document.querySelector('#available-posts button');
const postList = document.querySelector('ul');


function sendHttpRequest(method, url, data){
    return fetch(url, {
        method: method, // default is GET
        body: JSON.stringify(data), // converting the data into json
        headers: {
            'Content-Type': 'application/json' // a way to tell the server that the data sent with the request is a json data
        }
    }).then(response=>{
        if(response.status>=200&&response.status<300){
            return response.json(); // the json method will parse and convert the body of the response
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

// fetching data using promise + async await 
async function fetchPosts(){
    try{
        // const responseData = await sendHttpRequest('GET', 'https://jsonplaceholder.typicode.com/posts');

        const response = await axios.get('https://jsonplaceholder.typicode.com/posts');
        // axios always returning promises
        // the difference between axios and the fetch api is 
        // that axios is not returning streamed data
        // so you dont have to convert it into js objects and arrays 
        // to work with the data returned 
        // the data fetched by axios is in form of an object
        // with config, data, headers, request, status, statusText as the property

        // console.log(response); => object




        // const listOfPosts = responseData;
        const listOfPosts = response.data; // accesing the data property in the response object
        // the data property contains array

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

    // sendHttpRequest('POST','https://jsonplaceholder.typicode.com/posts', post);
    const response = await axios.post('https://jsonplaceholder.typicode.com/posts', post);
    console.log(response);
    // we dont have to add headers specifying the content-type
    // axios will transform the data into a json then adding the header for you

    // but axios won't always convert it to an object, it only be like that when the data you send is an object/ an array
    // it will adapt to what type of data you're sending
}

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
        axios.delete(`https://jsonplaceholder.typicode.com/posts/${postId}`);
    }
})