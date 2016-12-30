import { diff as deepDiff } from 'deep-diff';

let defaultOpts = {
  forceUpdate: false
};

let set = function(node, newValue, options = {}) {
  let _opts = Object.assign({}, defaultOpts, options);
  let { forceUpdate } = _opts;

  if (forceUpdate) {
    node.$requestUpdate( deepDiff(null, newValue) );

  } else {
    let curVal = node.$val();
    if (curVal === newValue) return;
    let rawDiff = deepDiff(curVal, newValue);
    if (!rawDiff) return;
    node.$requestUpdate(rawDiff);
  }
};

export default set;