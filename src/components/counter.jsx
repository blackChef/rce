import React from 'react';
import createComponent from 'helpers/createComponent.jsx';

let name = 'counter';

let init = function() {
  return 0;
};

let update = function({ type, payload, model, dispatch }) {
  if (type == 'increment') {
    model.$set( model.$val() + 1 );
  } else if (type == 'decrement') {
    model.$set( model.$val() - 1 );
  }
};

let view = function ({ model, dispatcher }) {
  return (
    <div>
      <button type="button" onClick={dispatcher('increment')} >+</button>
      <span>{model.$val()}</span>
      <button type="button" onClick={dispatcher('decrement')}>-</button>
    </div>
  );
};

view = createComponent({ name, update, view });
export { name, init, view };
