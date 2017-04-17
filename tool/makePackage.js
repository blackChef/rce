let { copySync, removeSync } = require('fs-extra');
let { readdirSync } = require('fs');
let resolve = require('path').resolve.bind(undefined, __dirname);
let compileES6 = require('./compileES6');

let src = '../package';
let dist = '../readyToPublish';

let resolveRoot = resolve.bind(undefined, '../');
let resolveSrc = resolve.bind(undefined, src);
let resolveDist = resolve.bind(undefined, dist);

let copyFiles = function() {
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
  } catch(e) {}
};

removeSync(resolveDist());
copyFiles();
compileES6(dist);


