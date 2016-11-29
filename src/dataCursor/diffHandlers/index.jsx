import handleEdit from './edit.jsx';
import handleDelete from './delete.jsx';
import pipe from 'lodash/flow';
import curry from 'lodash/curry';

let getHandler = function(diff) {
  let { kind } = diff;

  if (kind === 'D') {
    return handleDelete;
  }

  else if (kind === 'E') {
    return handleEdit;
  }

  else if (kind === 'N') {
    return handleEdit;
  }
};


// [diffItem] -> pipe[diffHandlers]
let makeFlow = function(diffs, setTarget) {
  let flow = diffs.map( function(item) {
    return getHandler(item)(item, setTarget);
  });

  return pipe(flow);
};

// root = { a: { b: 0 } }
// root.a.set({ b: 1 })
// setTarget: a; where update method is called
// diffTarget: b; where actual diff is happend
let applyDiffs = function(diffs, setTarget, root) {
  let flow = makeFlow(diffs, setTarget);
  return flow(root);
};

export default curry(applyDiffs);