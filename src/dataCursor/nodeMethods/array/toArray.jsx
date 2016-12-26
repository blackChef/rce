import memoize from 'lodash/memoize';
import isInteger from 'lodash/isInteger';

let toArray = function(instance) {
  return Object.keys(instance)
    .filter(i => isInteger(+i))
    .sort((a, b) => a - b)
    .reduce((preVal, key) => preVal.concat(instance[key]), []);
};

export default toArray;