import React from 'react';
import memoize from 'lodash/memoize';
import once from 'lodash/once';
import range from 'lodash/range';
import curry from 'lodash/curry';
import createComponent from 'helpers/createComponent.jsx';
import { view as Counter } from './counter.jsx';
import { arrAppend, arrRemove, arrPop } from 'dc-cursor';

let name = 'counterList';

let init = function() {
  return range(5).map(item => {
    return { id: item, count: 0 };
  });
};

let update = function({ type, payload, model, dispatch }) {
  if (type == 'add') {
    arrAppend(model, {
      id: Date.now(),
      count: 0
    });
  }

  else if (type == 'removeLast') {
    arrPop(model);
  }

  else if (type == 'removeItem') {
    arrRemove(model, item => item.id == payload);
  }
};


let renderItem = memoize(function(itemModel, dispatch) {
  let id = itemModel.id.$val();
  return (
    <div
      key={id}
      style={{ display: 'flex' }}
    >
      <Counter model={itemModel.count}/>
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
  let counters = model.$toArray().map(function(itemModel) {
    return renderItem(itemModel, dispatch);
  });

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