import curry from 'lodash/curry';
import pipe from 'lodash/flow';
import handleEdit from './edit.jsx';
import aInitial from 'lodash/initial';
import nGet from '../utils/nodeGet.jsx';
import reflectChildren from '../utils/reflectChildren.jsx';
import nAssoc from '../utils/nodeAssoc.jsx';
import oSet from '../utils/objectSet.jsx';

let updateDiffTargetParentGetter = curry(function _updateDiffTargetParentGetter(diffTargetPath, root) {
  let diffTargetParentPath = aInitial(diffTargetPath);
  let diffTargetParent = nGet(diffTargetParentPath, root);
  let newDiffTargetParent = reflectChildren(diffTargetParent);
  return oSet(diffTargetParentPath, newDiffTargetParent, root);
});


let handler = function(diff, setTarget, root) {
  let {
    constructor,
    _path: setTargetPath,
  } = setTarget;

  let {
    path: diffPath = [],
    rhs: newValue,
  } = diff;

  let diffTargetPath = setTargetPath.concat(diffPath);

  let ret = pipe([
    handleEdit(diff, setTarget),
    updateDiffTargetParentGetter(diffTargetPath),
  ])(root);

  return ret;
};


export default curry(handler);