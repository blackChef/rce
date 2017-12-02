let isEqual = function(a, b) {
  if (a.length !== b.length) {
    return false;
  }

  return a.find(function(item, index) {
    return item !== b[index];
  }) === undefined;
};


// Unlike memoize, this function only remember previous one result
let makePureCalcFunction = function(fn) {
  let cachedArgs = [];
  let cachedResult = undefined;

  return function(...args) {
    if (isEqual(cachedArgs, args)) {
      return cachedResult;
    }

    cachedResult = fn(...args);
    cachedArgs = args;
    return cachedResult;
  };
};

export default makePureCalcFunction;