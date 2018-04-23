import React from 'react';
import createClass from 'create-react-class';
import { view as Counter, init as counterInit } from './counter';

let init = function() {
  return {
    countA: counterInit(),
    countB: counterInit(),
  };
};

let view = createClass({
  render() {
    return (
      <div>
        <Counter model={this.props.model.countA} />
        <Counter model={this.props.model.countB} />
      </div>
    );
  },
});

export { init, view };