import React from 'react';
import createClass from 'create-react-class';

let init = function() {
  return 0;
};

let view = createClass({
  increase() {
    this.props.model.set(this.props.model.val() + 1);
  },
  decrease() {
    this.props.model.set(this.props.model.val() - 1);
  },
  render() {
    return (
      <div>
        <button type="button" onClick={this.decrease}>-</button>
        <span>{this.props.model.val()}</span>
        <button type="button" onClick={this.increase}>+</button>
      </div>
    );
  },
});

export { view, init };