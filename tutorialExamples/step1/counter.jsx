import React from 'react';
import createClass from 'create-react-class';

let Counter = createClass({
  getInitialState() {
    return { count: 0 };
  },
  increase() {
    this.setState({ count: this.state.count + 1 });
  },
  decrease() {
    this.setState({ count: this.state.count - 1 });
  },
  render() {
    return (
      <div>
        <button type="button" onClick={this.decrease}>-</button>
        <span>{this.state.count}</span>
        <button type="button" onClick={this.increase}>+</button>
      </div>
    );
  },
});

export default Counter;