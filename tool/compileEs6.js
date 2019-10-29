const { transformFileSync } = require('babel-core');
const { removeSync, outputFileSync } = require('fs-extra');
const last = require('lodash/last');
const filewalker = require('filewalker');
const resolve = require('path').resolve.bind(undefined, __dirname);

const babelOpts = {
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

const doBabel = filePath => transformFileSync(filePath, babelOpts);

const renameJsx = fileName => last( fileName.split('\\') ).replace('.jsx', '.js');

const compileJsx = function(resolveDist) {
  return function(path) {
    if ( !/\.jsx$/.test(path) ) return;

    const inputPath = resolveDist(path);
    const outputPath = resolveDist( renameJsx(path) );

    outputFileSync(
      outputPath,
      doBabel(inputPath).code
    );

    removeSync(inputPath);
  };
};

const logFinished = () => console.log('finished');;

module.exports = function(dist) {
  const resolveDist = resolve.bind(undefined, dist);

  filewalker(resolveDist())
    .on('file', compileJsx(resolveDist))
    .on('done', logFinished)
    .walk();
};

