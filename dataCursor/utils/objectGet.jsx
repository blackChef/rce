import curry from 'lodash/curry';
import oGet from 'lodash/get';

// ['a', 'b', 'c'] -> srcNode -> srcNode.a.b.c
let get = function(path, src) {
  return path.length === 0? src : oGet(src, path);
};

export default curry(get);