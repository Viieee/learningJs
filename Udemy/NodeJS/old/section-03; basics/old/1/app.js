// create a server through nodejs

// importing a module
const http = require('http'); // with this method you can also import a js file
          
// request listener, the createServer argument
function rqListener(req, res){
    // this function takes 2 arguments, 
    // 1st argument represent the incoming request
    // 2nd argument represent the response that can be returned
    console.log(req.url, req.method, req.headers);
    
    // fill it with data we want to send back
    res.setHeader('Content-Type', 'text/html'); // setting contentHeader in header
        // write some data to the response
        // it is possible to write html code
        // but you have to write it line per line
    res.write('<html>');
    res.write('<head><title>Enter Message</title><head>');
    res.write('<body><form action="/message" method="POST"><input type="text" name="message"><button type="submit">Send</button></form></body>');
    res.write('</html>');
        // ending the writing process and send it back to the client
        // you cannot use write method again after this
    rest.end()
}

// create server
const server = http.createServer(rqListener) // the argument of this method is a function that will be executed
                                            // for every incoming request

server.listen(3000); // 1st argument is the port 