import isArray from 'lodash/isArray';
let insert = function(node, index, maybeArray) {
  let newItems = isArray(maybeArray) ? maybeArray : [maybeArray];
  let val = nodel.val();

  node.set([
    ...val.slice(0, index),
    ...newItems,
    ...val.slice(index)
  ]);
};

export default insert;