import Cortex from 'cortexjs';
import isFunction from 'lodash/fp/isFunction';

let createProxyModel = function(onRequestRead, onRequestUpdate = () => {}) {
  let val = isFunction(onRequestRead) ?
    onRequestRead() :
    onRequestRead;

  let proxy =  new Cortex(val, newNode => {
    onRequestUpdate( newNode.val() );
  });

  return proxy;
};

export default createProxyModel;