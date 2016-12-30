import pipe from 'lodash/flow';
import curry from 'lodash/curry';
import cRemove from '../utils/collectionRemove.jsx';
import { s_path } from '../symbols.jsx';
import updateValue from './updateValue.jsx';

let getNewVal = curry(function(diffTargetPath, oldVal, valPath) {
  let newVal = cRemove(valPath, oldVal);
  return newVal;
});

let handler = function(diff, setTarget, root) {
  let {
    path: diffPath = [],
  } = diff;

  let setTargetPath = setTarget[s_path];
  let diffTargetPath = [...setTargetPath, ...diffPath];

  let ret = pipe([
    cRemove(diffTargetPath),
    updateValue(diffTargetPath, getNewVal(diffTargetPath)),
  ])(root);

  return ret;
};


export default curry(handler);