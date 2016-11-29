import curry from 'lodash/curry';
import getRealPath from './getRealPath.jsx';
import assoc from './objectAssoc.jsx';

// ['a', 'b', 'c'] -> newValue -> srcNode -> updatedSrcNode
let set = function(path, newValue, src) {
  return assoc(getRealPath(path), newValue, src);
};

export default curry(set);