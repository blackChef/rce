let { copySync, removeSync } = require('fs-extra');
let { readdirSync } = require('fs');
let resolve = require('path').resolve.bind(undefined, __dirname);
let compileEs6 = require('./compileEs6');

let src = '../package';
let dest = '../readyToPublish';

copySync(
  resolve('../package.json'),
  resolve(dest, 'package.json')
);

compileEs6(
  readdirSync(src).map(i => resolve(src, i)),
  resolve(dest)
);
