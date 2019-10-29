import Cortex from 'cortexjs';

const createCursor = function(initVal, onUpdate) {
  let isListening = true;

  const instance = new Cortex(initVal, function(newInstance) {
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