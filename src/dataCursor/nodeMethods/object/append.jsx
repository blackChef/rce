import isObject from 'lodash/isPlainObject';


// object node -> { key: value... } -> ()
let add = function(node, newItems) {
  let diffs;

  diffs = Object.keys(newItems).map( function(key) {
    return {
      kind: 'N',
      path: [key],
      rhs: newItems[key]
    };
  });

  node.$requestUpdate(diffs);
};


export default add;