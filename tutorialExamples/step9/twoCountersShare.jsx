import React from 'react';
import createClass from 'create-react-class';
import { view as Counter, init as counterInit } from './counter';

let init = function() {
  return {
    count: counterInit()
  };
};

let view = createClass({
  displayName: 'TwoCountersShare',
  render() {
    return (
      <div>
        <Counter model={this.props.model.count} />
        <Counter model={this.props.model.count} />
      </div>
    );
  },
});

export { init, view };
