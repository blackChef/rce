import curry from 'lodash/curry';

let create = function(constructor, value, path = []) {
  return new constructor(value, path);
};

export default curry(create);
