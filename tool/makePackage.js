let { copySync, removeSync } = require('fs-extra');
let { readdirSync } = require('fs');
let resolve = require('path').resolve.bind(undefined, __dirname);


let src = '../package';
let dest = '../readyToPublish';


copySync(
  resolve('../package.json'),
  resolve(dest, 'package.json')
);

readdirSync(src).forEach(function(item) {
  copySync(
    resolve(src, item),
    resolve(dest, item.replace('.jsx', '.js'))
  );
});
