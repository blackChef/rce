import { s_isTransformedFromArr } from '../symbols.jsx';
import isArray from 'lodash/isArray';

let toObj = function(arr) {
  let ret = arr.reduce(function(preVal, curItem, index) {
    return Object.assign(preVal, { [index]: curItem });
  }, {});

  ret[s_isTransformedFromArr] = true;

  return ret;
};

let toArr = function(obj) {
  return Object.keys(obj).sort().map(function(key) {
    return obj[key];
  });
};

let toObjIfNeeded = function(val) {
  if ( isArray(val) ) {
    return toObj(val);
  } else {
    return val;
  }
};

let toArrIfNeeded = function(val) {
  if (val[s_isTransformedFromArr]) {
    return toArr(val);
  } else {
    return val;
  }
};

export { toObj, toArr, toObjIfNeeded, toArrIfNeeded };