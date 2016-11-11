import curry from 'lodash/curry';
import copyAncestors from './copyAncestors.jsx';
import aInitial from 'lodash/initial';
import aLast from 'lodash/last';
import aRemove from 'lodash/remove';
import oUnset from 'lodash/unset';
import isArray from 'lodash/isArray';
import getAllNodePaths from './getAllNodePaths.jsx';
import oGet from './objectGet.jsx';

let remove = function(path, src) {
  let allNodepaths = getAllNodePaths(path);
  let ancestorPaths = aInitial(allNodepaths);

  let ret = copyAncestors(ancestorPaths, src);

  let targetParent = oGet(allNodepaths[allNodepaths.length - 2], ret);
  let targetKey = aLast(path);

  if ( isArray(targetParent) ) {
    aRemove(targetParent, (_, i) => i == targetKey);

  } else {
    oUnset(targetParent, targetKey);
  }

  return ret;
};

export default curry(remove);