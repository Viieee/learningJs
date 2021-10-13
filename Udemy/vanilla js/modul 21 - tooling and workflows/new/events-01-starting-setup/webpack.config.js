const path = require('path'); // path package

module.exports = {
    entry: './src/app.js', // path to the entry point from this file (webpack.config.js)
    output: { // configuring all about the output of the bundling process
        filename: 'app.js', // name of the file we will be generating using the bundling process
        path: path.resolve(__dirname, 'assets', 'scripts') // path of the targeted folder

    }
};