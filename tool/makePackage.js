const { copySync, removeSync } = require('fs-extra');
const resolve = require('path').resolve.bind(undefined, __dirname);
const compileES6 = require('./compileES6');

const src = '../package';
const dist = '../readyToPublish';

const resolveRoot = resolve.bind(undefined, '../');
const resolveSrc = resolve.bind(undefined, src);
const resolveDist = resolve.bind(undefined, dist);

const copyFiles = function() {
  copySync(
    resolveSrc(),
    resolveDist()
  );

  copySync(
    resolveRoot('package.json'),
    resolveDist('package.json')
  );

  try {
    copySync(
      resolveRoot('README.md'),
      resolveDist('README.md')
    );
  } catch(e) {
    console.log(e);
  }
};

removeSync(resolveDist());
copyFiles();
compileES6(dist);


