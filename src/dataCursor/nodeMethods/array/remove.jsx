import includes from 'lodash/includes';
import range from 'lodash/range';

// array node -> (itemVal -> itemIndex -> valLength -> bool) -> ()
let remove = function(node, predicate) {
  let curNodeVal = node.$val();

  let removedIndexes = curNodeVal.reduce(function(preVal, val, index) {
    let shouldRemove = predicate(val, index, curNodeVal.length);

    if (shouldRemove) {
      return preVal.concat(index);
    } else {
      return preVal;
    }
  }, []);

  let initialRemovedIndex = removedIndexes[0];
  let changedItems = curNodeVal.slice(initialRemovedIndex);
  let remainedItems = changedItems.filter(function(item, index) {
    return !removedIndexes.includes(index + initialRemovedIndex);
  });

  let updateDiffs = remainedItems.reduce(function(preVal, item, index) {
    let indexInNewArray = index + initialRemovedIndex;

    let diffItem = {
      kind: 'E',
      path: [indexInNewArray],
      rhs: item
    };

    return [...preVal, diffItem];
  }, []);


  let removeCount = changedItems.length - remainedItems.length;
  let removeDiffs = range(removeCount).map(function(i) {
    return {
      kind: 'A',
      index: initialRemovedIndex + remainedItems.length + i,
      item: { kind: 'D' }
    };
  });

  let diffs = [...updateDiffs, ...removeDiffs];

  node.$requestUpdate(diffs);
};

export default remove;