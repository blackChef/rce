import curry from 'lodash/curry';
import getRealPath from './getRealPath.jsx';
import oGet from './objectGet.jsx';

// ['a', 'b', 'c'] -> srcNode -> srcNode._children.a._children.b._children.c
let get = function(path, src) {
  return oGet(getRealPath(path), src);
};

export default curry(get);