import React from 'react';
import memoize from 'lodash/memoize';
import range from 'lodash/range';
import curry from 'lodash/curry';
import createComponent from 'helpers/createComponent.jsx';
import { view as Counter } from './counter.jsx';
import { arrayAppend, arrayRemove, arrayPop } from 'dataCursor/index.jsx';

let name = 'counterList';

let init = function() {
  return range(1000).map(item => {
    return { id: item, count: 0 };
  });
};

let update = function({ type, payload, model, dispatch }) {
  if (type == 'add') {
    arrayAppend(model, {
      id: Date.now(),
      count: 0
    });
  }

  else if (type == 'removeLast') {
    arrayPop(model);
  }

  else if (type == 'removeItem') {
    arrayRemove(model, item => item.id == payload);
  }
};


let renderItem = curry(function(dispatch, counterItemModel) {
  let id = counterItemModel.id.val();
  return (
    <div
      key={id}
      style={{ display: 'flex' }}
    >
      <span>{id}</span>
      <Counter model={counterItemModel.count}/>
      <button
        type="button"
        onClick={() => dispatch('removeItem', id)}
      >
        remove this counter
      </button>
    </div>
  );
});

let view = function({ model, dispatch, dispatcher }) {
  let counters = model.toArray().map(renderItem(dispatch));

  return (
    <div>
      <section className="section">
        {counters}
      </section>

      <section className="section">
        <button type="button" onClick={dispatcher('add')}>add counter</button>
        <button type="button" onClick={dispatcher('removeLast')}>remove last counter</button>
      </section>
    </div>
  );
};

view = createComponent({ name, update, view });
export { init, view };