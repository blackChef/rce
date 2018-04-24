import React from 'react';
import createClass from 'create-react-class';
import { Counter, counterInit } from './counter';

let TwoCounters = createClass({
  getInitialState() {
    return { count: counterInit() };
  },
  increase() {
    this.setState({ count: this.state.count + 1 });
  },
  decrease() {
    this.setState({ count: this.state.count - 1 });
  },
  render() {
    let counterProps = {
      count: this.state.count,
      increase: this.increase,
      decrease: this.decrease,
    };

    return (
      <div>
        <Counter {...counterProps}/>
        <Counter {...counterProps}/>
      </div>
    );
  },
});

export default TwoCounters;