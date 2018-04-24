import React from 'react';
import createComponent from './createComponent';

let init = function() {
  return {
    count: 0,
    loadingStatus: ''
  };
};

let fakeAsyncCall = function() {
  return new Promise(function(resolve) {
    setTimeout(resolve, 1000);
  });
};

let update = function({ type, model, payload, getLastetModel }) {
  if (type === 'increase') {
    model.count.set(model.count.val() + payload);
  }

  else if (type === 'decrease') {
    model.count.set(model.count.val() - payload);
  }

  else if (type === 'submit') {
    model.loadingStatus.set('loading');
    fakeAsyncCall().then(function() {
      getLastetModel().loadingStatus.set('success');
    });
  }
};

let name = 'Counter';

let view =  function({  model, dispatch }) {
  let isLoading = model.loadingStatus.val() === 'loading';
  return (
    <div>
      <button type="button" onClick={() => dispatch('decrease', 1)}>-</button>
      <span>{model.count.val()}</span>
      <button type="button" onClick={() => dispatch('increase', 1)}>+</button>

      <button type="button" onClick={() => dispatch('increase', 10)}>+10</button>

      <button type="button"
        onClick={() => dispatch('submit')}
        disabled={isLoading}
      >
        { isLoading ? 'loading' : 'submit' }
      </button>
    </div>
  );
};

view = createComponent({ name, view, update});

export { view, init };