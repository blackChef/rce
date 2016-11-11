import forEach from 'lodash/forEach';

let createGetter = function(key) {
  return function() {
    return this._children[key]; // "this" is dynamic
  };
};

// make children available for direct visiting
export default function(node) {
  forEach(node._children, function _defineGetter(val, key) {
    Object.defineProperty(node, key, {
      configurable: true,
      enumerable: true,
      get: createGetter(key)
    });
  });

  return node;
};