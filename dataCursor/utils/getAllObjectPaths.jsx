import aJoin from 'lodash/join';
import memoize from 'lodash/memoize';
import aLast from 'lodash/last';
import expandPath from './expandPath.jsx';

let getAllObjectPaths = function(path) {
  return [
    [], // root
    ...expandPath(path)
  ];
};

export default memoize(getAllObjectPaths, aJoin);
