// create a server through nodejs

// importing a module
const http = require('http'); // with this method you can also import a js file
const fs = require('fs'); // allows us to work with file system

const server = http.createServer((req, res) => {
  const url = req.url; // parsing the url
  const method = req.method; // parsing the method
  if (url === '/') {
    // if the url is only '/' it will render the html code below
    // basically at the start when we load the page
    res.write('<html>');
    res.write('<head><title>Enter Message</title><head>');
    res.write('<body><form action="/message" method="POST"><input type="text" name="message"><button type="submit">Send</button></form></body>');
    // if we clicked the button, it will send us to /message url and the method is no longer GET
    // and changed into POST 
    // the name on the input tag will be the key of the input value
    res.write('</html>');
    return res.end(); // ending the writing and returning the response
  }
  if (url === '/message' && method === 'POST') {
    // if the url is /message and the method is POST this will execute
    const body = []; // will be used to store the data chunks 
    
    // event listener
    req.on('data', (chunk) => {
      // the data event will be fired whenever a new chunk is ready to be read
      // buffer will help with this
      // and the second argument is the function which will be executed 
      // every time the event fired
      // and the data event will returned some chunk of the data itself
      console.log(chunk);
      body.push(chunk); // pushing the data into the body array
    });
    return req.on('end', () => {
      // will be fired once the parsing process of the incoming request is done
      // we will interact with the chunks in this function
      const parsedBody = Buffer.concat(body).toString(); // concatenate all the items in the body array
                                                        // then convert it into string
      const message = parsedBody.split('=')[1]; // storing the parsed body value only
                                                // because in default the parsed body 
                                                // returned key and the value 
                                                // now it will only return the value 
                                                // because we turn it into an array 
                                                // with split method and separate the 
                                                // full value on '=' sign
      fs.writeFileSync('message.txt', message); // storing the value into the message.txt file
      res.statusCode = 302;
      res.setHeader('Location', '/'); // redirecting the url when we go to the /message url to the default page
      return res.end(); // ending the writing and returning the response
    });
  }

  // this code will run before the req on event listeners run
  res.setHeader('Content-Type', 'text/html');
  res.write('<html>');
  res.write('<head><title>My First Page</title><head>');
  res.write('<body><h1>Hello from my Node.js Server!</h1></body>');
  res.write('</html>');
  res.end();
});

server.listen(3000);
