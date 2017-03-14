let { resolve } = require('path');
let { resolvePlugin, resolvePreset } = require('webpack-babel-link');

module.exports = {
  entry: {
    index: './demo/index.jsx',
  },
  output: {
    filename: './demo/[name].js',
  },
  resolve: {
    extensions: [".js", ".jsx"],
  },
  module: {
    rules: [{
      test: /\.jsx?$/,
      exclude: /(node_modules|bower_components)/,
      loader: 'babel-loader',
      query: {
        plugins: [
          'transform-es2015-destructuring',
          'transform-object-rest-spread',
        ].map( resolvePlugin(require) ),
        presets: ['react'].map( resolvePreset(require) )
      }
    }]
  },
};
