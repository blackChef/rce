import Cortex from 'cortexjs';
import isFunction from 'lodash/fp/isFunction';
import createModel from './cursor';

let createProxyModel = function(onRequestRead, onRequestUpdate = () => {}) {
  let val = isFunction(onRequestRead) ?
    onRequestRead() :
    onRequestRead;

  let proxy = createModel(val, newNode => {
    onRequestUpdate( newNode.val() );
    proxy.unListen();
  });

  return proxy;
};

export default createProxyModel;