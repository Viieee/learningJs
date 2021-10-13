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
    res.write('</html>');
    return res.end(); // ending the writing and returning the response
  }
  if (url === '/message' && method === 'POST') {
    // if the url is /message and the method is POST this will execute
    fs.writeFileSync('message.txt', 'DUMMY'); // creating a new file called message.txt
    res.statusCode = 302;
    res.setHeader('Location', '/'); // redirecting the url when we go to the /message url
    return res.end(); // ending the writing and returning the response
  }
  res.setHeader('Content-Type', 'text/html');
  res.write('<html>');
  res.write('<head><title>My First Page</title><head>');
  res.write('<body><h1>Hello from my Node.js Server!</h1></body>');
  res.write('</html>');
  res.end();
});

server.listen(3000);
