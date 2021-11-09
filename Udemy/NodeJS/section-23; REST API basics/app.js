const express = require("express");
const bodyParser = require("body-parser");

const app = express();

// routes
const feedRoutes = require("./routes/feed");

app.use(bodyParser.json()); // parsing incoming json data

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*"); // to any client allowed access
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE"
  ); // the request methods allowed
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use("/feed", feedRoutes);

app.listen(8080);

// const getButton = document.getElementById('get')
// const postButton = document.getElementById('post')

// getButton.addEventListener('click', ()=>{
//   fetch('http://localhost:8080/feed/posts')
//   .then(res => res.json() // waiting for the body to be completely streamed and convert it to js object )
//   .then(resData => console.log(resData))
//   .catch(err=>{
//     console.log(err)
//   })
// })

// <button id='get'>get posts</button>
// <button id='post'>create post</button>