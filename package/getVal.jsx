export default function(maybeFn) {
  if ( typeof maybeFn === 'function' ) {
    return maybeFn();
  } else {
    return maybeFn;
  }
};