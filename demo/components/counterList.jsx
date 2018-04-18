import React from 'react';
import range from 'lodash/range';
import createComponent from '../../package/createComponent';
import { view as Counter } from './counter';


let name = 'counterList';

let init = function() {
  return range(5).map(item => {
    return { id: item, count: 0 };
  });
};

let handleAdd = function({ model }) {
  model.set(
    [
      ...model.val(),
      { id: Date.now(), count: 0 }
    ]
  );
};

let handleRemoveLast = function({ model }) {
  model.set(
    model.val().slice(0, model.val().length - 1)
  );
};

let handleRemoveItem = function({ payload, model }) {
  model.set(
    model.val().filter(i => i.id !== payload)
  );
};

let update = function(arg) {
  // Update is just a function,
  // we could use switch, map lookup, or any other tools to solve "too many ifs" problem.
  switch (arg.type) {
    case 'add':
      handleAdd(arg);
      break;

    case 'removeLast':
      handleRemoveLast(arg);
      break;

    case 'removeItem':
      handleRemoveItem(arg);
      break;
  }
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