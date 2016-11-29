import isObject from 'lodash/isPlainObject';


// node -> key -> value ->
// node -> { key1: value, key2: value } ->
let add = function(node, ...args) {
  let diffs;
  if ( isObject(args[0]) ) {
    let newItems = args[0];
    diffs = Object.keys(newItems).map( function(key) {
      return {
        kind: 'N',
        path: [key],
        rhs: newItems[key]
      };
    });

  } else {
    let [key, value] = args;
    diffs = [{
      kind: 'N',
      path: [key],
      rhs: value,
    }];
  }

  node._requestUpdate(diffs, node);
};


export default add;