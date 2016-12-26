import React from 'react';
import createComponent from 'helpers/createComponent.jsx';
import uncontrolled from 'helpers/createUncontrolledComponent.jsx';
import either from 'helpers/either.jsx';
import maybe from 'helpers/maybe.jsx';
import { view as Counter, init as counterInit } from './counter.jsx';

let name = 'test';

let init = counterInit;

let update = function({ type, payload, model, dispatch }) {};

let Content = either(
  p => p.model.$val() !== 5,
  () => <h1>5</h1>,
  Counter
);

// let Content = maybe(
//   p => p.model.$val() !== 5,
//   Counter
// );

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

