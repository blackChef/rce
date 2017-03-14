import Cortex from 'cortexjs';

let createProxyModel = function(onRequestRead, onRequestUpdate = () => {}) {
  let val = typeof onRequestRead === 'function' ?
    onRequestRead() :
    onRequestRead;

  let proxy =  new Cortex(val, newNode => {
    onRequestUpdate( newNode.val() );
  });

  return proxy;
};

export default createProxyModel;