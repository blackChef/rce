import curry from 'lodash/curry';
import oSet from 'lodash/set';

// mutate src
let set = function(path, newValue, src) {
  if (path.length === 0) {
    src = newValue;
    return newValue;
  } else {
    return oSet(src, path, newValue);
  }
};

export default curry(set);
