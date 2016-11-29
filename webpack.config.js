let { resolve } = require('path');
let SplitByPathPlugin = require('webpack-split-by-path');

let splitByPath = new SplitByPathPlugin([
  { name: 'cursor', path: resolve(__dirname, './src/dataCursor') },
  { name: 'react', path: resolve(__dirname, 'node_modules/react') },
  { name: 'lodash', path: resolve(__dirname, 'node_modules/lodash') },
]);

module.exports = {
  entry: {
    index: './src/index.jsx',
  },
  output: {
    path: 'dist',
    filename: '[name].js',
    chunkFilename: '[name].js'
  },
  plugins: [splitByPath],
  resolve: {
    modules: [
      resolve(__dirname, 'node_modules'),
      resolve(__dirname, 'src'),
    ]
  },
  module: {
    rules: [{
      test: /\.jsx?$/,
      exclude: /(node_modules|bower_components)/,
      loader: 'babel-loader',
      query: {
        plugins: [
          'transform-es2015-modules-commonjs',
          'transform-es2015-destructuring',
          'transform-object-rest-spread',
        ],
        presets: ['react']
      }
    }, ]
  },
};
