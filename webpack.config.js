let { resolve } = require('path');
let webpack = require('webpack');
let SplitByPathPlugin = require('webpack-split-by-path');

let splitByPath = new SplitByPathPlugin([
  { name: 'cursor', path: resolve(__dirname, './src/dataCursor') },
  { name: 'react', path: resolve(__dirname, 'node_modules/react') },
  { name: 'lodash', path: resolve(__dirname, 'node_modules/lodash') },
]);

let definePlugin = new webpack.DefinePlugin({
  'process.env.NODE_ENV': process.env.NODE_ENV,
});

module.exports = {
  entry: {
    index: './src/index.jsx',
  },
  output: {
    path: 'dist',
    filename: '[name].js',
    chunkFilename: '[name].js'
  },
  plugins: [splitByPath, definePlugin],
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
