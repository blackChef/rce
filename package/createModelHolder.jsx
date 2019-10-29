import React from 'react';
import { useState, useRef, useEffect } from 'react';
import getVal from './getVal';
import createModel from './cursor';

// initialValue: function | value
const useModelHolder = function(initialValue) {
  const onUpdate = useRef(null);
  const [model, updateModel] = useState(function() {
    return createModel(getVal(initialValue), newModel => { onUpdate.current(newModel); });
  });
  onUpdate.current = updateModel;

  useEffect(function() {
    return () => model.unListen();
  }, []);
  return model;
};

const hoc = function(Component, initialValue) {
  const RceModelHolder = function(props) {
    const model = useModelHolder(initialValue);
    return <Component {...props} model={model} />;
  };
  return RceModelHolder;
};

export default hoc;
export { useModelHolder };


