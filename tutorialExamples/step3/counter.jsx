import React from 'react';
import createClass from 'create-react-class';

let counterInit = function() {
  return 0;
};

let Counter = createClass({
  render() {
    return (
      <div>
        <button type="button" onClick={this.props.decrease}>-</button>
        <span>{this.props.count}</span>
        <button type="button" onClick={this.props.increase}>+</button>
      </div>
    );
  },
});

export { Counter, counterInit };