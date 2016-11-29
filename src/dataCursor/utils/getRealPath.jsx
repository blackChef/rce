import curry from 'lodash/curry';
import aJoin from 'lodash/join';
import memoize from 'lodash/memoize';



// ['a', 'b', 'c'] -> [_children, 'a', _children, 'b', _children, 'c']
let getRealPath = function(path) {
  return path.reduce(function _concatPath(preVal, curItem) {
    return [...preVal, '_children', curItem];
  }, []);
};

getRealPath = memoize(getRealPath, aJoin);

export default getRealPath;

