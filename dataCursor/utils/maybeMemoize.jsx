import memoize from 'lodash/memoize';
import curry from 'lodash/curry';

// (args -> cacheKey) ->
// (args -> Bool shouldUseMemoize) ->
// (a -> a) ->
// maybeMemoizedFn
let maybeMemoize = function(resolver, predicate, fn) {
  let memoizedFn = memoize(fn, resolver);

  let maybeMemoized = function(...args) {
    let shouldUseMemoizedFn = predicate(...args);

    if (shouldUseMemoizedFn) {
      return memoizedFn(...args);
    } else {
      return fn(...args);
    }
  };

  return maybeMemoized;
};

export default curry(maybeMemoize);