import createNode from '../utils/createNode.jsx';
import curry from 'lodash/curry';
import oAssoc from '../utils/objectAssoc.jsx';
import pipe from 'lodash/flow';
import { s_path, s_val } from '../symbols.jsx';
import updateValGenerator from './updateValGenerator.jsx';
import oSet from '../utils/objectSet.jsx';
import { toArrIfNeeded } from '../utils/arrayLike.jsx';


let getNewVal = curry(function(diffTargetPath, newValue, oldVal, valPath) {
  let newVal = valPath.length ? oSet(valPath, newValue, oldVal) : newValue;
  return newVal;
});

let handler = function(diff, setTarget, root) {
  let {
    constructor,
  } = setTarget;

  let {
    path: diffPath = [],
    rhs: newValue,
  } = diff;

  let setTargetPath = setTarget[s_path];
  let diffTargetPath = [...setTargetPath, ...diffPath];
  let newDiffTarget = createNode(constructor, newValue, diffTargetPath);

  return pipe([
    oAssoc(diffTargetPath, newDiffTarget),
    updateValGenerator(diffTargetPath, getNewVal(diffTargetPath, newValue)),
  ])(root);
};

export default curry(handler);
