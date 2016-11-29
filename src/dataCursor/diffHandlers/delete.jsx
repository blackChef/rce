import pipe from 'lodash/flow';
import curry from 'lodash/curry';
import cRemove from '../utils/collectionRemove.jsx';
import { s_path } from '../symbols.jsx';
import updateValGenerator from './updateValGenerator.jsx';


let createValGenerator = curry(function(diffTargetPath, getOldVal, index) {
  return function getVal() {
    let oldVal = getOldVal();
    let valuePath = diffTargetPath.slice(index);
    return cRemove(valuePath, oldVal);
  };
});

let handler = function(diff, setTarget, root) {
  let {
    path: diffPath = [],
  } = diff;

  let setTargetPath = setTarget[s_path];
  let diffTargetPath = [...setTargetPath, ...diffPath];

  let ret = pipe([
    updateValGenerator(diffTargetPath, createValGenerator(diffTargetPath)),
    cRemove(diffTargetPath),
  ])(root);

  return ret;
};


export default curry(handler);