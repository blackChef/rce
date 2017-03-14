import React from 'react';
import memoize from 'lodash/memoize';
import once from 'lodash/once';
import range from 'lodash/range';
import curry from 'lodash/curry';
import createComponent from '../../package/createComponent';
import { view as Counter } from './counter';

let name = 'counterList';

let init = function() {
  return range(5).map(item => {
    return { id: item, count: 0 };
  });
};

let update = function({ type, payload, model, dispatch }) {
  if (type == 'add') {
    model.set(
      [
        ...model.val(),
        { id: Date.now(), count: 0 }
      ]
    );
  }

  else if (type == 'removeLast') {
    model.set(
      model.val().slice(0, model.val().length - 1)
    );
  }

  else if (type == 'removeItem') {
    model.set(
      model.val().filter(i => i.id !== payload)
    );
  }
};


let renderItem = memoize(function(itemModel, dispatch) {
  let id = itemModel.id.val();
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
  let counters = model.map(function(itemModel) {
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