import getVal from './getVal';
import createModel from './cursor';

let createProxyModel = function(onRequestRead, onRequestUpdate = () => {}) {
  let val = getVal(onRequestRead);
  let proxy = createModel(val, newNode => {
    onRequestUpdate( newNode.val() );
    proxy.unListen();
  });

  return proxy;
};

export default createProxyModel;