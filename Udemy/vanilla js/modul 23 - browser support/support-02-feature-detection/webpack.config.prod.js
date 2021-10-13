const path = require('path');
const CleanPlugin = require('clean-webpack-plugin');

module.exports = {
  mode: 'production',
  entry: './src/app.js',
  output: {
    filename: '[contenthash].js',
    path: path.resolve(__dirname, 'assets', 'scripts'),
    publicPath: 'assets/scripts/'
  },
  devtool: 'cheap-source-map',
  // devServer: {
  //   contentBase: './'
  // }
  module: { // intructions to webpack how to treat different modules
    rules: [ 
      {
        test: /\.m?js$/,
        // the rule above is basically saying that only all files with js/mjs extension 
        // should be handled/treated with this rule
        exclude: /node_modules/,
        // excluding all mjs/js files in node_modules folder
        use: {
            loader: 'babel-loader',
            options: {
            presets: [
              [
                  '@babel/preset-env', 
                { useBuiltIns:'usage', 
                corejs: {version: 3.12},
                targets: "defaults" }
              ]
            ]
            }
        }
        
      }
    ]
  },
  plugins: [
    new CleanPlugin.CleanWebpackPlugin()
  ]
};