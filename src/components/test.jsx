import React from 'react';
import createComponent from 'helpers/createComponent.jsx';
import uncontrolled from 'helpers/createModelHolder.jsx';
import { view as Counter, init as counterInit } from './counter.jsx';

let name = 'test';

let init = counterInit;

let update = function({ type, payload, model, dispatch }) {};

let view = React.createClass({
  render() {
    let { model } = this.props;

    return (
      <div>
        test
      </div>
    );
  },
});


view = createComponent({ name, update, view });
view = uncontrolled(view, init());
export { init, view };

