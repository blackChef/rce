import React from 'react';
import memoize from 'lodash/memoize';
import range from 'lodash/range';
import createComponent from 'helpers/createComponent.jsx';
import { view as Counter } from './counter.jsx';
import { arrayAppend, arrayRemove, arrayPop } from 'dataCursor/index.jsx';

let name = 'counterList';

let init = function() {
  return range(0).map(item => {
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


let _counter = createComponent({
  name: '_counter',
  view({ model, requestRemove }) {
    return (
      <div style={{ display: 'flex' }}>
        <Counter model={model}/>
        <button
          type="button"
          onClick={requestRemove}
        >
          remove this counter
        </button>
      </div>
    );
  }
});


let getId = (_, props) => props.id;

let view = React.createClass({
  renderCounter(counterItem) {
    let id = counterItem.id.val();
    return (
      <_counter
        key={id}
        model={counterItem.count}
        requestRemove={this.removeCounter(id)}
      />
    );
  },

  componentWillMount() {
    this.removeCounter = memoize(id => {
      return () => this.props.dispatch('removeItem', id);
    });
  },

  render() {
    let { dispatcher } = this.props;
    let counters = this.props.model.toArray().map(this.renderCounter);

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
  },
});


view = createComponent({ name, update, view });
export { init, view };