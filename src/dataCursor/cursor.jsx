import isArray from 'lodash/isArray';
import isObject from 'lodash/isPlainObject';
import createNode from './utils/createNode.jsx';
import curry from 'lodash/curry';
import oMapValues from 'lodash/mapValues';
import { s_path, s_rawVal } from './symbols.jsx';
import toArray from './nodeMethods/toArray.jsx';
import setVal from './nodeMethods/setVal.jsx';
import getVal from './nodeMethods/getVal.jsx';

let wrapObject = function(factory, value, path) {
  return oMapValues(value, function(val, key) {
    return factory( val, path.concat(key) );
  });
};

let wrapArray = function(factory, value, path) {
  return value.map( function(item, index) {
    return factory( item, path.concat(index) );
  });
};

let wrapChildren = curry(function(factory, value) {
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
    this[s_rawVal] = value;
  }

  $val() {
    return getVal(this);
  }

  $set(newValue, opts) {
    return setVal(this, newValue, opts);
  }

  $toArray() {
    return toArray(this);
  }
};


let createFactory = function(onRequestUpdate) {
  class Cursor extends BaseClass {
    constructor(...args) {
      let [value, path] = args;

      super(value, path);

      let children = _wrapChildren(value, path);
      Object.assign(this, children);
    }

    $requestUpdate(rawDiff) {
      onRequestUpdate(rawDiff.map(parseDiff), this);
    }
  };

  let factory = createNode(Cursor);
  let _wrapChildren = wrapChildren(factory);

  return factory;
};


export default createFactory;
