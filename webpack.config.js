let { resolve } = require('path');

module.exports = {
  entry: {
    index: './index.jsx',
  },
  output: {
    filename: '[name].js' // Template based on keys in entry above
  },
  resolve: {
    root: [
      resolve(__dirname, 'node_modules'),
      resolve(__dirname, './'),
    ]
  },
  module: {
    loaders: [{
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel',
        query: {
          plugins: [
            'transform-es2015-modules-commonjs',
            'transform-es2015-destructuring',
            'transform-object-rest-spread',
          ],
          presets: ['react']
        }
      },
    ]
  },
};