const path = require('path');

module.exports = [{
  mode: 'production',
  entry: './Interface Text Formatting Tool v4.js',
  output: {
    filename: 'Interface.js',
    path: path.resolve(__dirname, 'dist')
  }
},
{
  mode: 'production',
  entry: './Interface Text Formatting Tool v4.js',
  output: {
    filename: 'Interface_ie.js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
        }
      }
    ]
  }
}];