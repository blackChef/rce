import isObject from 'lodash/isPlainObject';


// object node -> key -> value -> ()
// object node -> { key1: value, key2: value } -> ()
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

  node.$requestUpdate(diffs, node);
};


export default add;