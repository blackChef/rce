import curry from 'lodash/curry';
import oGet from '../utils/objectGet.jsx';
import getAllNodePaths from '../utils/getAllNodePaths.jsx';
import oAssoc from '../utils/objectAssoc.jsx';
import once from 'lodash/once';

let updateValGenerator = function(diffTargetPath, createValGenerator, root) {
  let allNodePaths = getAllNodePaths(diffTargetPath);

  return allNodePaths.reduce(function assignValGenerator(preVal, path, index) {
    // node.val would be replaced, save copy here
    let node = oGet(path, preVal);
    let getOldVal = node.val;

    let newValGenerator = once(createValGenerator(getOldVal, index));
    return oAssoc([...path, 'val'], newValGenerator, preVal);
  }, root);
};

export default curry(updateValGenerator);
