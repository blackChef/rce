import createFactory from './cursor.jsx';
import applyDiffs from './diffHandlers/index.jsx';
import pipe from 'lodash/flow';
import curry from 'lodash/curry';
import defer from 'lodash/defer';
import { startDiffHandler } from './eventEmitter.jsx';
import isFunction from 'lodash/isFunction';


/*
  root = { a: { b: 0 } }
  root.a.$set({ b: 1 })
  setTarget: a; where update method is called
  diffTarget: b; where actual diff is happend
*/

let applyDiffQueue = function(diffQueue, root) {
  startDiffHandler();

  let flow = diffQueue.map( function({ diffs, setTarget }) {
    return applyDiffs(diffs, setTarget);
  });

  return pipe(flow)(root);
};


let initCursor = function(initialValue, onUpdate) {
  let diffQueue = [];
  let isUpdating = false;
  let isListening = true;
  let previousRoot;

  let enqueueDiffs = function(diffs, setTarget) {
    diffQueue.push({ diffs, setTarget });
  };

  let cleanup = function() {
    diffQueue = [];
    isUpdating = false;
  };

  let onChange = function(diffs, setTarget) {
    if (!isListening) return;

    enqueueDiffs(diffs, setTarget);

    if (!isUpdating) {
      isUpdating = true;

      defer(function applyResult() {
        // let t = performance.now();
        let newRoot = applyDiffQueue(diffQueue, previousRoot);
        // console.log('perf', performance.now() - t);
        onUpdate(newRoot);
        previousRoot = newRoot;
        cleanup();
      });
    }
  };

  previousRoot = createFactory(onChange)(initialValue);

  Object.defineProperty(previousRoot, 'unListen', {
    enumerable: false,
    value: function() {
      isListening = false;
      previousRoot = undefined;
    }
  });

  return previousRoot;
};

// a way to define "computed/proxy cursor"
let createProxyCursor = function(onRequestRead, onRequestUpdate = () => {}) {
  let val = isFunction(onRequestRead) ? onRequestRead() : onRequestRead;

  let proxy = initCursor(val, newValue => {
    onRequestUpdate(newValue.$val());
    proxy.unListen();
  });

  return proxy;
};


export { default as toArray } from './nodeMethods/toArray.jsx';
export { default as arrayAppend } from './nodeMethods/array/append.jsx';
export { default as arrayPop } from './nodeMethods/array/pop.jsx';
export { default as arrayInsert } from './nodeMethods/array/insert.jsx';
export { default as arrayRemove } from './nodeMethods/array/remove.jsx';
export { default as objectRemove } from './nodeMethods/object/remove.jsx';
export { default as objectAppend } from './nodeMethods/object/append.jsx';
export default initCursor;
export { createProxyCursor };
