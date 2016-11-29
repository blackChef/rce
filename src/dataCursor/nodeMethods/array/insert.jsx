import isArray from 'lodash/isArray';


let safeAdd = function(a, b) {
  let m = +a;
  let n = +b;
  return m + n;
};


// node -> targetIndex -> value | [value] ->
let insert = function(node, targetIndex, maybeArray) {
  if (targetIndex < 0) {
    console.warn('Negative index is not supported');
  }

  let values = isArray(maybeArray) ? maybeArray : [maybeArray];
  let curNodeVal = node.val();

  if ( !isArray(curNodeVal) ) {
    throw('Array insert failed: target node is not an array');
  }


  // l = [0, 1, 2]
  // r = [0, 'a', 'b', 'c',  1, 2]
  // changedItems = ['a', 'b', 'c', 1, 2]
  let changedItems = [...values, ...curNodeVal.slice(targetIndex)];

  let curNodeValLength = curNodeVal.length;

  let diffs = changedItems.reduce(function(preVal, item, index) {
    let indexInNewArray = safeAdd(index, targetIndex);

    let diffItem;
    if (indexInNewArray < curNodeValLength) {
      diffItem = {
        kind: 'E',
        path: [indexInNewArray],
        rhs: item
      };

    } else {
      diffItem = {
        kind: 'A',
        index: indexInNewArray,
        item: { kind: 'N', rhs: item }
      };
    }

    return [...preVal, diffItem];
  }, []);

  node._requestUpdate(diffs, node);
};

export default insert;