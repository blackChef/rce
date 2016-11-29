import createNode from '../utils/createNode.jsx';
import curry from 'lodash/curry';
import oAssoc from '../utils/objectAssoc.jsx';
import pipe from 'lodash/flow';
import { s_path } from '../symbols.jsx';
import updateValGenerator from './updateValGenerator.jsx';
import oSet from '../utils/objectSet.jsx';


let createValGenerator = curry(function(diffTargetPath, newValue, getOldVal, index) {
  return function getVal() {
    let oldVal = getOldVal();
    let valuePath = diffTargetPath.slice(index);
    if (valuePath.length) {
      return oSet(valuePath, newValue, oldVal);
    } else {
      return newValue;
    }
  };
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
    updateValGenerator(diffTargetPath, createValGenerator(diffTargetPath, newValue)),
  ])(root);
};

export default curry(handler);
