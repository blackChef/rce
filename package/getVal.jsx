import isFunction from 'lodash/fp/isFunction';

export default function(maybeFn) {
  if ( isFunction(maybeFn) ) {
    return maybeFn();
  } else {
    return maybeFn;
  }
};