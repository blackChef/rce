import isArray from 'lodash/isArray';
import isObject from 'lodash/isPlainObject';
import createNode from './utils/createNode.jsx';
import curry from 'lodash/curry';
import oMapValues from 'lodash/mapValues';
import { diff as deepDiff } from 'deep-diff';
import { s_path, s_val } from './symbols.jsx';
import toArray from './nodeMethods/toArray.jsx';

let wrapObject = function(createInstance, value, path) {
  return oMapValues(value, function(val, key) {
    return createInstance( val, path.concat(key) );
  });
};

let wrapArray = function(createInstance, value, path) {
  return value.map( function(item, index) {
    return createInstance( item, path.concat(index) );
  });
};

let wrapChildren = curry(function(createInstance, value, path) {
  if (value === undefined) {
    return;

  } else if( isObject(value) ) {
    return wrapObject(...arguments);

  } else if ( isArray(value) ) {
    return wrapArray(...arguments);
  }
});

let parseDiff = function(rawDiff) {
  if (rawDiff.kind === 'A') { // array add or delete, no lhs
    let parentDiff = rawDiff.path || [];

    return {
      kind: rawDiff.item.kind,
      path: [...parentDiff, rawDiff.index],
      rhs: rawDiff.item.rhs,
    };

  } else {
    return rawDiff;
  }
};

class BaseClass {
  constructor(value, path) {
    this[s_path] = path;

    // store raw value
    this[s_val] = value;

    // return parsed value
    this.$val = () => value;
  }

  $set(newValue) {
    let curVal = this.$val();
    if (curVal === newValue) return;

    let rawDiff = deepDiff(curVal, newValue);
    if (!rawDiff) return;

    this.$requestUpdate(rawDiff, this);
  }

  $toArray() {
    return toArray(this);
  }
};


let createFactory = function(onChange) {
  class Cursor extends BaseClass {
    constructor(...args) {
      let [value, path] = args;

      super(value, path);

      let children = _wrapChildren(value, path);
      Object.assign(this, children);
    }

    $requestUpdate(rawDiff, setTarget) {
      onChange(rawDiff.map( parseDiff), setTarget);
    }
  };

  let createInstance = createNode(Cursor);
  let _wrapChildren = wrapChildren(createInstance);

  return createInstance;
};


export default createFactory;
