import React from 'react';
import range from 'lodash/range';
import createComponent from '../../package/createComponent';
import { view as Counter } from './counter';
import uniqueId from 'lodash/uniqueId';


let name = 'counterList';

let init = function() {
  return range(5).map(() => {
    return { id: uniqueId(), count: 0 };
  });
};


let actions = {
  // { payload, model, dispatch, getLatestModel }
  add({ model }) {
    model.set(
      [
        ...model.val(),
        { id: uniqueId(), count: 0 }
      ]
    );
  },

  removeItem({ model, payload }) {
    model.set(
      model.val().filter(i => i.id !== payload)
    );
  },

  removeLast({ model }) {
    model.set(
      model.val().slice(0, model.val().length - 1)
    );
  }
};

let update = function(props) {
  let { type, ...otherProps } = props;
  actions[type](otherProps);
};

let view = function({ model, dispatcher }) {
  let counters = model.map(function(itemModel) {
    let id = itemModel.id.val();
    return (
      <div
        key={id}
        style={{ display: 'flex' }}
      >
        <Counter model={itemModel.count}/>
        <button
          type="button"
          onClick={dispatcher('removeItem', id)}
        >
          remove this counter
        </button>
      </div>
    );
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