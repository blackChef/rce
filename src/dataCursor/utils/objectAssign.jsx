import forEach from 'lodash/forEach';

let isValid = function(val) {
  return val !== undefined && val !== null;
};

let isGetter = function(key, object) {
  let desc = Object.getOwnPropertyDescriptor(object, key);

  if (desc.get) {
    return desc;
  } else {
    return false;
  }
};


// like Object.assign, but copy getter function
let assign = function (target, ...sources) {
  let ret = Object(target);

  forEach(sources, function(source) {
    if (!isValid(source)) return;

    forEach(source, function(val, key) {
      let mayBeGetter = isGetter(key, source);

      if (mayBeGetter) {
        Object.defineProperty(ret, key, mayBeGetter);

      } else {
        ret[key] = val;
      }
    });
  });

  return ret;
};


export default assign;