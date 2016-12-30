import curry from 'lodash/curry';
import oGet from '../utils/objectGet.jsx';
import getAllNodePaths from '../utils/getAllNodePaths.jsx';
import oAssoc from '../utils/objectAssoc.jsx';
import { s_rawVal } from '../symbols.jsx';
import { toObjIfNeeded } from '../utils/arrayLike.jsx';

// mutate root
let updateValue = function(diffTargetPath, getNewVal, root) {
  let allNodePaths = getAllNodePaths(diffTargetPath);

  allNodePaths.forEach(function(path, index) {
    let node = oGet(path, root);

    if (node !== undefined) {
      // to avoid issues with array add and delete,
      // node values that are array are stored as object,
      let oldVal = toObjIfNeeded(node[s_rawVal]);
      let valPath = diffTargetPath.slice(index);
      let newVal = getNewVal(oldVal, valPath);

      node[s_rawVal] = newVal;
    }
  });

  return root;
};

export default curry(updateValue);
