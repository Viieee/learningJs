// this file will be executed by node js under the hood
const { assert } = require('console');
const path = require('path');
const cleanPlugin = require('clean-webpack-plugin');

// exporting something in node js
// exposing the object in node js outside of the file and webpack
module.exports = {
    // entry file
    mode: 'development', // the default value of this mode property is 'production'
                         // if it is in the production mode, webpack will 
                         // implement some optimization for the bundle 
    entry: './events-01-starting-setup/src/app.js',
    output: { // this is the place were the bundled file will be stored
        filename: 'app.js',
        path: path.resolve(__dirname, 'events-01-starting-setup', 'assets', 'scripts'), // same as ./assets/scripts/
        publicPath: 'events-01-starting-setup/assets/scripts/'
        
        // publicPath is being used as a map to tell the webpack
        // where the extra files needed to be load
    }, 
    devServer: {
        contentBase: './events-01-starting-setup/', // where your root html file can be found
        writeToDisk: true
    },
    devtool: 'cheap-module-eval-source-map', // how webpack links your file to the original code 
                                            // theres a lot of other options for the devtool 
                                            // read the documentation
                                            // after you add this, you can find your original code
                                            // on the source tab on the browser and you can also
                                            // place breakpoints in it.
    plugins: [
        new cleanPlugin.CleanWebpackPlugin()
    ] // concept in webpack that allows you to apply various optimization or 
    // transformation on the generated output folder
};