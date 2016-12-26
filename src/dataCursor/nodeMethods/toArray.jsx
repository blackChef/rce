import isInteger from 'lodash/isInteger';

let toArray = function(node) {
  return Object.keys(node)
    .filter(i => isInteger(+i))
    .sort((a, b) => a - b)
    .map(key => node[key])
};

export default toArray;