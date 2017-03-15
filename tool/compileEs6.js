let { resolve } = require('path');
let { resolvePlugin, resolvePreset } = require('webpack-babel-link');
let { transformFileSync } = require('babel-core');
let { outputFileSync } = require('fs-extra');
let _ = require('lodash');

let babelOpts = {
  babelrc: false,
  plugins: [
    'transform-es2015-destructuring',
    'transform-object-rest-spread',
  ].map( resolvePlugin(require) ),
  presets: ['react'].map( resolvePreset(require) )
};


let compileEs6 = function(files, outputPath) {
  let entries = files.map(function(src) {
    let name = _.last( src.split('\\') ).replace('.jsx', '.js');

    return {
      src,
      dest: resolve(outputPath, name)
    };
  });

  entries.forEach(function({ src, dest }) {
    let { code } = transformFileSync(src, babelOpts);
    outputFileSync(dest, code);
  });
};

module.exports = compileEs6;