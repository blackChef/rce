let { transformFileSync } = require('babel-core');
let { removeSync, outputFileSync } = require('fs-extra');
let last = require('lodash/last');
let filewalker = require('filewalker');
let resolve = require('path').resolve.bind(undefined, __dirname);

let babelOpts = {
  babelrc: false,
  plugins: [
    'transform-object-rest-spread',
  ],
  presets: [
    'react',
    ['env', {
      targets: { browser: [`last 6 versions`] },
      modules: false,
      loose: true,
    }]
  ]
};

let doBabel = filePath => transformFileSync(filePath, babelOpts);

let renameJsx = fileName => last( fileName.split('\\') ).replace('.jsx', '.js');

let compileJsx = function(resolveDist) {
  return function(path) {
    if ( !/\.jsx$/.test(path) ) return;

    let inputPath = resolveDist(path);
    let outputPath = resolveDist( renameJsx(path) );

    outputFileSync(
      outputPath,
      doBabel(inputPath).code
    );

    removeSync(inputPath);
  };
};

let logFinished = () => console.log('finished');;

module.exports = function(dist) {
  let resolveDist = resolve.bind(undefined, dist);

  filewalker(resolveDist())
    .on('file', compileJsx(resolveDist))
    .on('done', logFinished)
    .walk();
};

