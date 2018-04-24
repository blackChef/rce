import React from 'react';
import createClass from 'create-react-class';
import { Counter, counterInit } from './counter';

let TwoCountersNoShare = createClass({
  getInitialState() {
    return {
      countA: counterInit(),
      countB: counterInit(),
    };
  },
  setCountA(newCount) {
    this.setState({ countA: newCount });
  },
  setCountB(newCount) {
    this.setState({ countB: newCount });
  },
  render() {
    return (
      <div>
        <Counter count={this.state.countA} setCount={this.setCountA} />
        <Counter count={this.state.countB} setCount={this.setCountB} />
      </div>
    );
  },
});

export default TwoCountersNoShare;