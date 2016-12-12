import React from 'react';
import createComponent from 'helpers/createComponent.jsx';
import { view as Counter, init as counterInit } from 'components/counter.jsx';


let name = 'threeCounters';

let init = function() {
  return {
    countA: 0,
    countBC: 0,
  };
};

let update = function({ type, payload, model, dispatch }) {
  model.set( init() );
};

let view = function ({ model, dispatcher }) {
  return (
    <div>
      <section className="section">
        <div>counterA</div>
        <Counter model={model.countA} />
      </section>

      <section className="section">
        <p className="infoBanner">
          counterB and counterC share same model
        </p>

        <div>counterB</div>
        <Counter model={model.countBC} />

        <div>counterC</div>
        <Counter model={model.countBC} />
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
export { name, init, view };
