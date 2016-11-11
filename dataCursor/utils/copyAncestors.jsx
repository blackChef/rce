import oGet from './objectGet.jsx';
import oSet from './objectSet.jsx';
import isArray from 'lodash/isArray';
import curry from 'lodash/curry';
import memoize from 'lodash/memoize';
import aJoin from 'lodash/join';
import { onDiffHanlderStart } from '../eventEmitter.jsx';

let aClone = arr => arr.slice(0);
let oClone = src => Object.assign(new src.constructor(), src);

let assignClone = function(root, path) {
  let target = oGet(path, root);
  let clone = isArray(target)? aClone(target) : oClone(target);
  return oSet(path, clone, root);
};

// inside every "applyDiff cycle",
// we only want to clone affected node once
let assignClone_memoized = assignClone;
onDiffHanlderStart(function() {
  assignClone_memoized = memoize(assignClone, (_, path)  => aJoin(path));
});

let assignClone_onlyMemoizeCursor = function(root, path) {
  // we are updating cursor object,
  // the root object must the root Cursor object
  // we could memoize the result
  if (root.constructor.name === 'Cursor') {
    return assignClone_memoized(root, path);

  // we are updating other object, e.g. updating value.
  // we can't identify root, thus can't memoize the result
  } else {
    return assignClone(root, path);
  }
};

// this function doesn't mutate root,
// because ancestorPaths always starts with [].
// inside reducer, root is replaced by its clone at first loop
let copyAncestors = function(ancestorPaths, root) {
  if (ancestorPaths.length === 0) {
    return assignClone_onlyMemoizeCursor(root, []);
  } else {
    return ancestorPaths.reduce(assignClone_onlyMemoizeCursor, root);
  }
};

export default curry(copyAncestors);