import aJoin from 'lodash/join';
import memoize from 'lodash/memoize';
import aLast from 'lodash/last';

let concatPath = function(preVal, curItem) {
  let prevItem = aLast(preVal) || [];
  let newItem = [...prevItem, curItem];
  return [...preVal, newItem];
};

// ['a', 'b', 'c'] -> [ ['a'], ['a', 'b'], ['a', 'b', 'c'] ]
let expandPath = function(path) {
  return path.reduce(concatPath, []);
};


let getAllNodePaths = function(path) {
  return [
    [], // root
    ...expandPath(path)
  ];
};

export default memoize(getAllNodePaths, aJoin);
