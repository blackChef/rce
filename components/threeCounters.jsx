import React from 'react';
import createComponent from 'helpers/createComponent.jsx';
import { view as Counter, init as counterInit } from 'components/counter.jsx';


let name = 'threeCounters';

let init = function() {
  return {
    count: 0,
    anotherCount: 0,
  };
};

let update = function({ type, payload, model, dispatch }) {
  model.set( init() );
};

let view = function ({ model, dispatch }) {
  return (
    <div>
      <section className="section">
        <div>counterA</div>
        <Counter model={model.count} />
      </section>

      <section className="section">
        <p className="infoBanner">
          counterB and counterC share same model, thus in sync
        </p>

        <div>counterB</div>
        <Counter model={model.anotherCount} />

        <div>counterC</div>
        <Counter model={model.anotherCount} />
      </section>

      <section className="section">
        <button
          type="button"
          onClick={() => dispatch('reset')}
        >
          reset all
        </button>
      </section>
    </div>
  );
};

view = createComponent({ name, update, view });
export { name, init, view };
