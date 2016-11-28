import React from 'react';
import createComponent from 'helpers/createComponent.jsx';
import uncontrolled from 'helpers/createUncontrolledComponent.jsx';
import either from 'helpers/either.jsx';
import { view as Counter, init as counterInit } from './counter.jsx';

let name = 'test';

let init = counterInit;

let update = function({ type, payload, model, dispatch }) {};

let Content = either(
  p => p.model.val() !== 5,
  Counter,
  () => <h1>5</h1>
);

let view = React.createClass({
  render() {
    let { model } = this.props;

    return (
      <div>
        <Content model={model}/>
      </div>
    );
  },
});


view = createComponent({ name, update, view });
view = uncontrolled(view, init());
export { init, view };

