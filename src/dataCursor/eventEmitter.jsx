import ee from 'event-emitter';

let emitter = ee({});

let onDiffHanlderStart = function(cb) {
  emitter.on('startDiffHandler', cb);
};

let startDiffHandler = function() {
  emitter.emit('startDiffHandler');
};

export { onDiffHanlderStart, startDiffHandler };
