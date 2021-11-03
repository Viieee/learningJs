const path = require('path');

module.exports = path.dirname(require.main.filename);
/* 
    ? the exported function above will help us reach the parent directory
    ? require.main.filename is the file responsible for running this app (app.js)
*/