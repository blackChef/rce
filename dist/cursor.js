webpackJsonp([3,4],{

/***/ 149:
/***/ function(module, exports) {

"use strict";
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
const s_val = Symbol('val');
const s_path = Symbol('path');

exports.s_val = s_val;
exports.s_path = s_path;

/***/ },

/***/ 150:
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _join = __webpack_require__(254);

var _join2 = _interopRequireDefault(_join);

var _memoize = __webpack_require__(28);

var _memoize2 = _interopRequireDefault(_memoize);

var _last = __webpack_require__(140);

var _last2 = _interopRequireDefault(_last);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let concatPath = function (preVal, curItem) {
  let prevItem = (0, _last2.default)(preVal) || [];
  let newItem = [...prevItem, curItem];
  return [...preVal, newItem];
};

// ['a', 'b', 'c'] -> [ ['a'], ['a', 'b'], ['a', 'b', 'c'] ]
let expandPath = function (path) {
  return path.reduce(concatPath, []);
};

let getAllNodePaths = function (path) {
  return [[], // root
  ...expandPath(path)];
};

exports.default = (0, _memoize2.default)(getAllNodePaths, _join2.default);

/***/ },

/***/ 151:
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _curry = __webpack_require__(67);

var _curry2 = _interopRequireDefault(_curry);

var _get = __webpack_require__(249);

var _get2 = _interopRequireDefault(_get);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// ['a', 'b', 'c'] -> srcNode -> srcNode.a.b.c
let get = function (path, src) {
  return path.length === 0 ? src : (0, _get2.default)(src, path);
};

exports.default = (0, _curry2.default)(get);

/***/ },

/***/ 152:
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _curry = __webpack_require__(67);

var _curry2 = _interopRequireDefault(_curry);

var _set = __webpack_require__(424);

var _set2 = _interopRequireDefault(_set);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// mutate src
let set = function (path, newValue, src) {
  if (path.length === 0) {
    src = newValue;
    return newValue;
  } else {
    return (0, _set2.default)(src, path, newValue);
  }
};

exports.default = (0, _curry2.default)(set);

/***/ },

/***/ 17:
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createProxyCursor = exports.objectAppend = exports.objectRemove = exports.arrayRemove = exports.arrayInsert = exports.arrayPop = exports.arrayAppend = exports.toArray = undefined;

var _toArray = __webpack_require__(208);

Object.defineProperty(exports, 'toArray', {
  enumerable: true,
  get: function () {
    return _interopRequireDefault(_toArray).default;
  }
});

var _append = __webpack_require__(295);

Object.defineProperty(exports, 'arrayAppend', {
  enumerable: true,
  get: function () {
    return _interopRequireDefault(_append).default;
  }
});

var _pop = __webpack_require__(296);

Object.defineProperty(exports, 'arrayPop', {
  enumerable: true,
  get: function () {
    return _interopRequireDefault(_pop).default;
  }
});

var _insert = __webpack_require__(206);

Object.defineProperty(exports, 'arrayInsert', {
  enumerable: true,
  get: function () {
    return _interopRequireDefault(_insert).default;
  }
});

var _remove = __webpack_require__(207);

Object.defineProperty(exports, 'arrayRemove', {
  enumerable: true,
  get: function () {
    return _interopRequireDefault(_remove).default;
  }
});

var _remove2 = __webpack_require__(298);

Object.defineProperty(exports, 'objectRemove', {
  enumerable: true,
  get: function () {
    return _interopRequireDefault(_remove2).default;
  }
});

var _append2 = __webpack_require__(297);

Object.defineProperty(exports, 'objectAppend', {
  enumerable: true,
  get: function () {
    return _interopRequireDefault(_append2).default;
  }
});

var _cursor = __webpack_require__(291);

var _cursor2 = _interopRequireDefault(_cursor);

var _index = __webpack_require__(294);

var _index2 = _interopRequireDefault(_index);

var _flow = __webpack_require__(138);

var _flow2 = _interopRequireDefault(_flow);

var _curry = __webpack_require__(67);

var _curry2 = _interopRequireDefault(_curry);

var _eventEmitter = __webpack_require__(205);

var _isFunction = __webpack_require__(27);

var _isFunction2 = _interopRequireDefault(_isFunction);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
  root = { a: { b: 0 } }
  root.a.set({ b: 1 })
  setTarget: a; where update method is called
  diffTarget: b; where actual diff is happend
*/

let applyDiffQueue = function (diffQueue, root) {
  (0, _eventEmitter.startDiffHandler)();

  let flow = diffQueue.map(function ({ diffs, setTarget }) {
    return (0, _index2.default)(diffs, setTarget);
  });

  return (0, _flow2.default)(flow)(root);
};

let initCursor = function (initialValue, onUpdate) {
  let diffQueue = [];
  let isUpdating = false;
  let isListening = true;
  let previousRoot;

  let enqueueDiffs = function (diffs, setTarget) {
    diffQueue.push({ diffs, setTarget });
  };

  let cleanup = function () {
    diffQueue = [];
    isUpdating = false;
  };

  let onChange = function (diffs, setTarget) {
    if (!isListening) return;

    enqueueDiffs(diffs, setTarget);

    if (!isUpdating) {
      isUpdating = true;

      setTimeout(function applyResult() {
        // let t = performance.now();
        let newRoot = applyDiffQueue(diffQueue, previousRoot);
        // console.log('perf', performance.now() - t);
        onUpdate(newRoot);
        previousRoot = newRoot;
        cleanup();
      }, 0);
    }
  };

  previousRoot = (0, _cursor2.default)(onChange)(initialValue);

  Object.defineProperty(previousRoot, 'unListen', {
    enumerable: false,
    value: function () {
      isListening = false;
      previousRoot = undefined;
    }
  });

  return previousRoot;
};

// a way to define "computed/proxy cursor"
let createProxyCursor = function (onRequestRead, onRequestUpdate = () => {}) {
  let val = (0, _isFunction2.default)(onRequestRead) ? onRequestRead() : onRequestRead;

  let proxy = initCursor(val, newValue => {
    onRequestUpdate(newValue.val());
    proxy.unListen();
  });

  return proxy;
};

exports.default = initCursor;
exports.createProxyCursor = createProxyCursor;

/***/ },

/***/ 204:
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _curry = __webpack_require__(67);

var _curry2 = _interopRequireDefault(_curry);

var _objectGet = __webpack_require__(151);

var _objectGet2 = _interopRequireDefault(_objectGet);

var _getAllNodePaths = __webpack_require__(150);

var _getAllNodePaths2 = _interopRequireDefault(_getAllNodePaths);

var _objectAssoc = __webpack_require__(211);

var _objectAssoc2 = _interopRequireDefault(_objectAssoc);

var _once = __webpack_require__(419);

var _once2 = _interopRequireDefault(_once);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let updateValGenerator = function (diffTargetPath, createValGenerator, root) {
  let allNodePaths = (0, _getAllNodePaths2.default)(diffTargetPath);

  return allNodePaths.reduce(function assignValGenerator(preVal, path, index) {
    // node.val would be replaced, save copy here
    let node = (0, _objectGet2.default)(path, preVal);
    let getOldVal = node.val;

    let newValGenerator = (0, _once2.default)(createValGenerator(getOldVal, index));
    return (0, _objectAssoc2.default)([...path, 'val'], newValGenerator, preVal);
  }, root);
};

exports.default = (0, _curry2.default)(updateValGenerator);

/***/ },

/***/ 205:
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.startDiffHandler = exports.onDiffHanlderStart = undefined;

var _eventEmitter = __webpack_require__(78);

var _eventEmitter2 = _interopRequireDefault(_eventEmitter);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let emitter = (0, _eventEmitter2.default)({});

let onDiffHanlderStart = function (cb) {
  emitter.on('startDiffHandler', cb);
};

let startDiffHandler = function () {
  emitter.emit('startDiffHandler');
};

exports.onDiffHanlderStart = onDiffHanlderStart;
exports.startDiffHandler = startDiffHandler;

/***/ },

/***/ 206:
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _isArray = __webpack_require__(93);

var _isArray2 = _interopRequireDefault(_isArray);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let safeAdd = function (a, b) {
  let m = +a;
  let n = +b;
  return m + n;
};

// node -> targetIndex -> value | [value] ->
let insert = function (node, targetIndex, maybeArray) {
  if (targetIndex < 0) {
    console.warn('Negative index is not supported');
  }

  let values = (0, _isArray2.default)(maybeArray) ? maybeArray : [maybeArray];
  let curNodeVal = node.val();

  if (!(0, _isArray2.default)(curNodeVal)) {
    throw 'Array insert failed: target node is not an array';
  }

  // l = [0, 1, 2]
  // r = [0, 'a', 'b', 'c',  1, 2]
  // changedItems = ['a', 'b', 'c', 1, 2]
  let changedItems = [...values, ...curNodeVal.slice(targetIndex)];

  let curNodeValLength = curNodeVal.length;

  let diffs = changedItems.reduce(function (preVal, item, index) {
    let indexInNewArray = safeAdd(index, targetIndex);

    let diffItem;
    if (indexInNewArray < curNodeValLength) {
      diffItem = {
        kind: 'E',
        path: [indexInNewArray],
        rhs: item
      };
    } else {
      diffItem = {
        kind: 'A',
        index: indexInNewArray,
        item: { kind: 'N', rhs: item }
      };
    }

    return [...preVal, diffItem];
  }, []);

  node._requestUpdate(diffs, node);
};

exports.default = insert;

/***/ },

/***/ 207:
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _includes = __webpack_require__(412);

var _includes2 = _interopRequireDefault(_includes);

var _range = __webpack_require__(29);

var _range2 = _interopRequireDefault(_range);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let remove = function (node, predicate) {
  let curNodeVal = node.val();

  let removedIndexes = curNodeVal.reduce(function (preVal, val, index) {
    let shouldRemove = predicate(val, index, curNodeVal.length);

    if (shouldRemove) {
      return preVal.concat(index);
    } else {
      return preVal;
    }
  }, []);

  let initialRemovedIndex = removedIndexes[0];
  let changedItems = curNodeVal.slice(initialRemovedIndex);
  let remainedItems = changedItems.filter(function (item, index) {
    return !removedIndexes.includes(index + initialRemovedIndex);
  });

  let updateDiffs = remainedItems.reduce(function (preVal, item, index) {
    let indexInNewArray = index + initialRemovedIndex;

    let diffItem = {
      kind: 'E',
      path: [indexInNewArray],
      rhs: item
    };

    return [...preVal, diffItem];
  }, []);

  let removeCount = changedItems.length - remainedItems.length;
  let removeDiffs = (0, _range2.default)(removeCount).map(function (i) {
    return {
      kind: 'A',
      index: initialRemovedIndex + remainedItems.length + i,
      item: { kind: 'D' }
    };
  });

  let diffs = [...updateDiffs, ...removeDiffs];

  node._requestUpdate(diffs, node);
};

exports.default = remove;

/***/ },

/***/ 208:
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _memoize = __webpack_require__(28);

var _memoize2 = _interopRequireDefault(_memoize);

var _isInteger = __webpack_require__(413);

var _isInteger2 = _interopRequireDefault(_isInteger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let toArray = function (instance) {
  return Object.keys(instance).filter(i => (0, _isInteger2.default)(+i)).sort((a, b) => a - b).reduce((preVal, key) => preVal.concat(instance[key]), []);
};

exports.default = toArray;

/***/ },

/***/ 209:
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _objectGet = __webpack_require__(151);

var _objectGet2 = _interopRequireDefault(_objectGet);

var _objectSet = __webpack_require__(152);

var _objectSet2 = _interopRequireDefault(_objectSet);

var _isArray = __webpack_require__(93);

var _isArray2 = _interopRequireDefault(_isArray);

var _curry = __webpack_require__(67);

var _curry2 = _interopRequireDefault(_curry);

var _memoize = __webpack_require__(28);

var _memoize2 = _interopRequireDefault(_memoize);

var _join = __webpack_require__(254);

var _join2 = _interopRequireDefault(_join);

var _eventEmitter = __webpack_require__(205);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let aClone = arr => arr.slice(0);
let oClone = src => Object.assign(new src.constructor(), src);

let assignClone = function (root, path) {
  let target = (0, _objectGet2.default)(path, root);
  let clone = (0, _isArray2.default)(target) ? aClone(target) : oClone(target);
  return (0, _objectSet2.default)(path, clone, root);
};

// inside every "applyDiff cycle",
// we only want to clone affected node once
let assignClone_memoized = assignClone;
(0, _eventEmitter.onDiffHanlderStart)(function () {
  assignClone_memoized = (0, _memoize2.default)(assignClone, (_, path) => (0, _join2.default)(path));
});

let assignClone_onlyMemoizeCursor = function (root, path) {
  // we are updating cursor object,
  // the root object must the root Cursor object
  // we could memoize the result
  if (root.constructor.name === 'Cursor') {
    return assignClone_memoized(root, path);

    // we are updating other object, e.g. updating value.
    // we can't identify root, thus can't memoize the result
  } else {
    return assignClone(root, path);
  }
};

// this function doesn't mutate root,
// because ancestorPaths always starts with [].
// inside reducer, root is replaced by its clone at first loop
let copyAncestors = function (ancestorPaths, root) {
  if (ancestorPaths.length === 0) {
    return assignClone_onlyMemoizeCursor(root, []);
  } else {
    return ancestorPaths.reduce(assignClone_onlyMemoizeCursor, root);
  }
};

exports.default = (0, _curry2.default)(copyAncestors);

/***/ },

/***/ 210:
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _curry = __webpack_require__(67);

var _curry2 = _interopRequireDefault(_curry);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let create = function (constructor, value, path = []) {
  return new constructor(value, path);
};

exports.default = (0, _curry2.default)(create);

/***/ },

/***/ 211:
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _curry = __webpack_require__(67);

var _curry2 = _interopRequireDefault(_curry);

var _objectSet = __webpack_require__(152);

var _objectSet2 = _interopRequireDefault(_objectSet);

var _copyAncestors = __webpack_require__(209);

var _copyAncestors2 = _interopRequireDefault(_copyAncestors);

var _initial = __webpack_require__(251);

var _initial2 = _interopRequireDefault(_initial);

var _last = __webpack_require__(140);

var _last2 = _interopRequireDefault(_last);

var _getAllNodePaths = __webpack_require__(150);

var _getAllNodePaths2 = _interopRequireDefault(_getAllNodePaths);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// ['a', 'b'] -> newValue -> { a: { b: c } } -> { a: { b: newValue } }
let assoc = function (path, newValue, root) {
  let allNodepaths = (0, _getAllNodePaths2.default)(path);
  let ancestorPaths = (0, _initial2.default)(allNodepaths);
  let targetPath = (0, _last2.default)(allNodepaths);

  let ret = (0, _copyAncestors2.default)(ancestorPaths, root);
  (0, _objectSet2.default)(targetPath, newValue, ret);
  return ret;
};

exports.default = (0, _curry2.default)(assoc);

/***/ },

/***/ 291:
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _isArray = __webpack_require__(93);

var _isArray2 = _interopRequireDefault(_isArray);

var _isPlainObject = __webpack_require__(252);

var _isPlainObject2 = _interopRequireDefault(_isPlainObject);

var _createNode = __webpack_require__(210);

var _createNode2 = _interopRequireDefault(_createNode);

var _curry = __webpack_require__(67);

var _curry2 = _interopRequireDefault(_curry);

var _mapValues = __webpack_require__(416);

var _mapValues2 = _interopRequireDefault(_mapValues);

var _deepDiff = __webpack_require__(77);

var _symbols = __webpack_require__(149);

var _toArray = __webpack_require__(208);

var _toArray2 = _interopRequireDefault(_toArray);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let wrapObject = function (createInstance, value, path) {
  return (0, _mapValues2.default)(value, function (val, key) {
    return createInstance(val, path.concat(key));
  });
};

let wrapArray = function (createInstance, value, path) {
  return value.map(function (item, index) {
    return createInstance(item, path.concat(index));
  });
};

let wrapChildren = (0, _curry2.default)(function (createInstance, value, path) {
  if (value === undefined) {
    return;
  } else if ((0, _isPlainObject2.default)(value)) {
    return wrapObject(...arguments);
  } else if ((0, _isArray2.default)(value)) {
    return wrapArray(...arguments);
  }
});

let parseDiff = function (rawDiff) {
  if (rawDiff.kind === 'A') {
    // array add or delete, no lhs
    let parentDiff = rawDiff.path || [];

    return {
      kind: rawDiff.item.kind,
      path: [...parentDiff, rawDiff.index],
      rhs: rawDiff.item.rhs
    };
  } else {
    return rawDiff;
  }
};

class BaseClass {
  constructor(value, path) {
    this[_symbols.s_path] = path;
    this.val = () => value;
  }

  set(newValue) {
    let curVal = this.val();
    if (curVal === newValue) return;

    let rawDiff = (0, _deepDiff.diff)(curVal, newValue);
    if (!rawDiff) return;

    this._requestUpdate(rawDiff, this);
  }

  toArray() {
    return (0, _toArray2.default)(this);
  }
};

let createFactory = function (onChange) {
  class Cursor extends BaseClass {
    constructor(...args) {
      let value = args[0],
          path = args[1];


      super(value, path);

      let children = _wrapChildren(value, path);
      Object.assign(this, children);
    }

    _requestUpdate(rawDiff, setTarget) {
      onChange(rawDiff.map(parseDiff), setTarget);
    }
  };

  let createInstance = (0, _createNode2.default)(Cursor);
  let _wrapChildren = wrapChildren(createInstance);

  return createInstance;
};

exports.default = createFactory;

/***/ },

/***/ 292:
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _flow = __webpack_require__(138);

var _flow2 = _interopRequireDefault(_flow);

var _curry = __webpack_require__(67);

var _curry2 = _interopRequireDefault(_curry);

var _collectionRemove = __webpack_require__(299);

var _collectionRemove2 = _interopRequireDefault(_collectionRemove);

var _symbols = __webpack_require__(149);

var _updateValGenerator = __webpack_require__(204);

var _updateValGenerator2 = _interopRequireDefault(_updateValGenerator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let createValGenerator = (0, _curry2.default)(function (diffTargetPath, getOldVal, index) {
  return function getVal() {
    let oldVal = getOldVal();
    let valuePath = diffTargetPath.slice(index);
    return (0, _collectionRemove2.default)(valuePath, oldVal);
  };
});

let handler = function (diff, setTarget, root) {
  var _diff$path = diff.path;
  let diffPath = _diff$path === undefined ? [] : _diff$path;


  let setTargetPath = setTarget[_symbols.s_path];
  let diffTargetPath = [...setTargetPath, ...diffPath];

  let ret = (0, _flow2.default)([(0, _updateValGenerator2.default)(diffTargetPath, createValGenerator(diffTargetPath)), (0, _collectionRemove2.default)(diffTargetPath)])(root);

  return ret;
};

exports.default = (0, _curry2.default)(handler);

/***/ },

/***/ 293:
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createNode = __webpack_require__(210);

var _createNode2 = _interopRequireDefault(_createNode);

var _curry = __webpack_require__(67);

var _curry2 = _interopRequireDefault(_curry);

var _objectAssoc = __webpack_require__(211);

var _objectAssoc2 = _interopRequireDefault(_objectAssoc);

var _flow = __webpack_require__(138);

var _flow2 = _interopRequireDefault(_flow);

var _symbols = __webpack_require__(149);

var _updateValGenerator = __webpack_require__(204);

var _updateValGenerator2 = _interopRequireDefault(_updateValGenerator);

var _objectSet = __webpack_require__(152);

var _objectSet2 = _interopRequireDefault(_objectSet);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let createValGenerator = (0, _curry2.default)(function (diffTargetPath, newValue, getOldVal, index) {
  return function getVal() {
    let oldVal = getOldVal();
    let valuePath = diffTargetPath.slice(index);
    if (valuePath.length) {
      return (0, _objectSet2.default)(valuePath, newValue, oldVal);
    } else {
      return newValue;
    }
  };
});

let handler = function (diff, setTarget, root) {
  let constructor = setTarget.constructor;
  var _diff$path = diff.path;
  let diffPath = _diff$path === undefined ? [] : _diff$path,
      newValue = diff.rhs;


  let setTargetPath = setTarget[_symbols.s_path];
  let diffTargetPath = [...setTargetPath, ...diffPath];
  let newDiffTarget = (0, _createNode2.default)(constructor, newValue, diffTargetPath);

  return (0, _flow2.default)([(0, _objectAssoc2.default)(diffTargetPath, newDiffTarget), (0, _updateValGenerator2.default)(diffTargetPath, createValGenerator(diffTargetPath, newValue))])(root);
};

exports.default = (0, _curry2.default)(handler);

/***/ },

/***/ 294:
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _edit = __webpack_require__(293);

var _edit2 = _interopRequireDefault(_edit);

var _delete = __webpack_require__(292);

var _delete2 = _interopRequireDefault(_delete);

var _flow = __webpack_require__(138);

var _flow2 = _interopRequireDefault(_flow);

var _curry = __webpack_require__(67);

var _curry2 = _interopRequireDefault(_curry);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let getHandler = function (diff) {
  let kind = diff.kind;


  if (kind === 'D') {
    return _delete2.default;
  } else if (kind === 'E') {
    return _edit2.default;
  } else if (kind === 'N') {
    return _edit2.default;
  }
};

// [diffItem] -> pipe[diffHandlers]
let makeFlow = function (diffs, setTarget) {
  let flow = diffs.map(function (item) {
    return getHandler(item)(item, setTarget);
  });

  return (0, _flow2.default)(flow);
};

// root = { a: { b: 0 } }
// root.a.set({ b: 1 })
// setTarget: a; where update method is called
// diffTarget: b; where actual diff is happend
let applyDiffs = function (diffs, setTarget, root) {
  let flow = makeFlow(diffs, setTarget);
  return flow(root);
};

exports.default = (0, _curry2.default)(applyDiffs);

/***/ },

/***/ 295:
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _insert = __webpack_require__(206);

var _insert2 = _interopRequireDefault(_insert);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// node -> value | values ->
let append = function (node, newItems) {
  let curNodeVal = node.val();
  let curNodeValLength = curNodeVal.length;

  return (0, _insert2.default)(node, curNodeValLength, newItems);
};

exports.default = append;

/***/ },

/***/ 296:
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _remove = __webpack_require__(207);

var _remove2 = _interopRequireDefault(_remove);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let pop = function (node) {
  (0, _remove2.default)(node, function (val, index, length) {
    return index === length - 1;
  });
};

exports.default = pop;

/***/ },

/***/ 297:
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _isPlainObject = __webpack_require__(252);

var _isPlainObject2 = _interopRequireDefault(_isPlainObject);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// node -> key -> value ->
// node -> { key1: value, key2: value } ->
let add = function (node, ...args) {
  let diffs;
  if ((0, _isPlainObject2.default)(args[0])) {
    let newItems = args[0];
    diffs = Object.keys(newItems).map(function (key) {
      return {
        kind: 'N',
        path: [key],
        rhs: newItems[key]
      };
    });
  } else {
    let key = args[0],
        value = args[1];

    diffs = [{
      kind: 'N',
      path: [key],
      rhs: value
    }];
  }

  node._requestUpdate(diffs, node);
};

exports.default = add;

/***/ },

/***/ 298:
/***/ function(module, exports) {

"use strict";
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});


// node ->
// ( (val, key) -> Bool shouldRemove ) ->
let remove = function (node, predicate) {
  let nodeVal = node.val();
  let removedKeys = Object.keys(nodeVal).reduce(function (preVal, key) {
    let val = nodeVal[key];
    let shouldRemove = predicate(val, key);
    if (shouldRemove) {
      return preVal.concat(key);
    } else {
      return preVal;
    }
  }, []);

  let diffs = removedKeys.map(function (key) {
    return {
      kind: 'D',
      path: [key]
    };
  });

  node._requestUpdate(diffs, node);
};

exports.default = remove;

/***/ },

/***/ 299:
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _curry = __webpack_require__(67);

var _curry2 = _interopRequireDefault(_curry);

var _copyAncestors = __webpack_require__(209);

var _copyAncestors2 = _interopRequireDefault(_copyAncestors);

var _initial = __webpack_require__(251);

var _initial2 = _interopRequireDefault(_initial);

var _last = __webpack_require__(140);

var _last2 = _interopRequireDefault(_last);

var _remove = __webpack_require__(423);

var _remove2 = _interopRequireDefault(_remove);

var _unset = __webpack_require__(428);

var _unset2 = _interopRequireDefault(_unset);

var _isArray = __webpack_require__(93);

var _isArray2 = _interopRequireDefault(_isArray);

var _getAllNodePaths = __webpack_require__(150);

var _getAllNodePaths2 = _interopRequireDefault(_getAllNodePaths);

var _objectGet = __webpack_require__(151);

var _objectGet2 = _interopRequireDefault(_objectGet);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let remove = function (path, src) {
  let allNodepaths = (0, _getAllNodePaths2.default)(path);
  let ancestorPaths = (0, _initial2.default)(allNodepaths);

  let ret = (0, _copyAncestors2.default)(ancestorPaths, src);

  let targetParent = (0, _objectGet2.default)(allNodepaths[allNodepaths.length - 2], ret);
  let targetKey = (0, _last2.default)(path);

  if ((0, _isArray2.default)(targetParent)) {
    (0, _remove2.default)(targetParent, (_, i) => i == targetKey);
  } else {
    (0, _unset2.default)(targetParent, targetKey);
  }

  return ret;
};

exports.default = (0, _curry2.default)(remove);

/***/ }

});