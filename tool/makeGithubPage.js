let { copySync } = require('fs-extra');
let resolve = require('path').resolve.bind(undefined, __dirname);

let src = '../demo';
let dest = '../';

[
  'index.html',
  'index.css',
  'index.js',
].forEach(function(item) {
  copySync(
    resolve(src, item),
    resolve(dest, item)
  );
});
