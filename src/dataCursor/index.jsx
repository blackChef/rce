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

let State = class {
  constructor() {
    this.diffQueue = [];
    this.isUpdating = false;
    this.isListening = true;
    this.previousRoot = undefined;
  }

  enqueueDiffs(diffs, setTarget) {
    this.diffQueue.push({ diffs, setTarget });
  }

  destory() {
    delete this;
  }

  finishDiffs(newRoot) {
    this.previousRoot = newRoot;
    this.diffQueue = [];
    this.isUpdating = false;
  }
};

let createState = () => new State();

let onRequestUpdate = curry(function(state, onUpdate, diffs, setTarget) {
  if (!state.isListening) {
    state.destory();

  } else {
    state.enqueueDiffs(diffs, setTarget);

    if (!state.isUpdating) {
      state.isUpdating = true;

      defer(function applyResult() {
        let newRoot = applyDiffQueue(state.diffQueue, state.previousRoot);
        state.finishDiffs(newRoot);
        onUpdate(newRoot);
      });
    }
  }
});

let initCursor = function(initialValue, onUpdate) {
  // store state inside closure
  let state = createState();

  let initialRoot = createFactory(
    onRequestUpdate(state, onUpdate)
  )(initialValue);

  Object.defineProperty(initialRoot, '$unListen', {
    value: function() {
      state.isListening = false;
    }
  });

  state.previousRoot = initialRoot;

  return initialRoot;
};


// a way to define "computed/proxy cursor"
let createProxyCursor = function(onRequestRead, onRequestUpdate = () => {}) {
  let val = isFunction(onRequestRead) ? onRequestRead() : onRequestRead;

  let proxy = initCursor(val, newValue => {
    onRequestUpdate(newValue.$val());
    proxy.$unListen();
  });

  return proxy;
};


export { initCursor, createProxyCursor };
export { default as toArray } from './nodeMethods/toArray.jsx';
export { default as setVal } from './nodeMethods/setVal.jsx';
export { default as getVal } from './nodeMethods/getVal.jsx';
export { default as arrAppend } from './nodeMethods/array/append.jsx';
export { default as arrPop } from './nodeMethods/array/pop.jsx';
export { default as arrInsert } from './nodeMethods/array/insert.jsx';
export { default as arrRemove } from './nodeMethods/array/remove.jsx';
export { default as objAppend } from './nodeMethods/object/append.jsx';
export { default as objRemove } from './nodeMethods/object/remove.jsx';
