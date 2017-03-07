import React from 'react';
import createComponent from 'main/createComponent';
import uncontrolled from 'main/createModelHolder';
import { view as Counter, init as counterInit } from './counter';

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

