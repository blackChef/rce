import Cortex from 'cortexjs';

let createCursor = function(initVal, onUpdate) {
  let isListening = true;

  let instance = new Cortex(initVal, function(newInstance) {
    if (isListening) {
      onUpdate(newInstance);
    }
  });

  instance.unListen = function() {
    isListening = false;
  };

  return instance;
};

export default createCursor;