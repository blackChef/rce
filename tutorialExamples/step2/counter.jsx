import React from 'react';
import createClass from 'create-react-class';

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

export default Counter;