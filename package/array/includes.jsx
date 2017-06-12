import find from './find';

let includes = function(node, predicate) {
  return find(node, predicate) !== undefined;
};

export default includes;