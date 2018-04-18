import React from 'react';
import createComponent from '../../package/createComponent';
import { view as Counter, init as counterInit } from './counter';


let name = 'threeCounters';

let init = function() {
  return {
    countA: 0,
    countBC: 0,
  };
};

let update = function({ type, payload, model, dispatch }) {
  model.set( init() ); // only one type action
};

let view = function ({ model, dispatcher }) {
  return (
    <div>
      <section className="section">
        <h4>counterA</h4>
        <Counter model={model.countA} />
      </section>

      <section className="section">
        <h3>counterB and counterC share same model</h3>

        <section>
          <h4>counterB</h4>
          <Counter model={model.countBC} />
        </section>

        <section>
          <h4>counterC</h4>
          <Counter model={model.countBC} />
        </section>
      </section>

      <section className="section">
        <button
          type="button"
          onClick={dispatcher('reset')}
        >
          reset all
        </button>
      </section>
    </div>
  );
};

view = createComponent({ name, update, view });
export { init, view };
