import curry from 'lodash/curry';
import oGet from '../utils/objectGet.jsx';
import getAllNodePaths from '../utils/getAllNodePaths.jsx';
import oAssoc from '../utils/objectAssoc.jsx';
import { s_val } from '../symbols.jsx';
import { toObjIfNeeded, toArrIfNeeded } from '../utils/arrayLike.jsx';

let updateValGenerator = function(diffTargetPath, getNewVal, root) {
  let allNodePaths = getAllNodePaths(diffTargetPath);

  return allNodePaths.reduce(function assignValGenerator(prevResult, path, index) {
    let node = oGet(path, prevResult);

    if (node === undefined) {
      return prevResult;
    } else {
      // to avoid issues with array add and delete,
      // node values that are array are stored as object,
      let oldVal = toObjIfNeeded(node[s_val]);
      let valPath = diffTargetPath.slice(index);
      let newVal = getNewVal(oldVal, valPath);

      // mutate prevResult, but oAssoc return new root
      node[s_val] = newVal;

      return oAssoc([...path, '$val'], () => toArrIfNeeded(newVal), prevResult);
    }
  }, root);
};

export default curry(updateValGenerator);
