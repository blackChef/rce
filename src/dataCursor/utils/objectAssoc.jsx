import curry from 'lodash/curry';
import oSet from './objectSet.jsx';
import copyAncestors from './copyAncestors.jsx';
import aInitial from 'lodash/initial';
import aLast from 'lodash/last';
import getAllNodePaths from './getAllNodePaths.jsx';

// ['a', 'b'] -> newValue -> { a: { b: c } } -> { a: { b: newValue } }
let assoc = function(path, newValue, root) {
  let allNodepaths = getAllNodePaths(path);
  let ancestorPaths = aInitial(allNodepaths);
  let targetPath = aLast(allNodepaths);

  let ret = copyAncestors(ancestorPaths, root);
  oSet(targetPath, newValue, ret);
  return ret;
};

export default curry(assoc);