import { toArrIfNeeded } from '../utils/arrayLike.jsx';
import { s_rawVal } from '../symbols.jsx';

let getVal = function(node) {
  return toArrIfNeeded(node[s_rawVal]);
};

export default getVal;