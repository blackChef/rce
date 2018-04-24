import React from 'react';
import createClass from 'create-react-class';

let counterInit = function() {
  return 0;
};

let Counter = createClass({
  increase() {
    this.props.setCount(this.props.count + 1);
  },
  decrease() {
    this.props.setCount(this.props.count - 1);
  },
  render() {
    return (
      <div>
        <button type="button" onClick={this.decrease}>-</button>
        <span>{this.props.count}</span>
        <button type="button" onClick={this.increase}>+</button>
      </div>
    );
  },
});

export { Counter, counterInit };