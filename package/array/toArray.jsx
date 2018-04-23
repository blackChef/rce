import isInteger from 'lodash/isInteger';

let toArray = function(node) {
  let keys = Object.keys(node).filter(i => isInteger(+i));
  return keys.map(function(key) {
    return node[key];
  });
};

export default toArray;