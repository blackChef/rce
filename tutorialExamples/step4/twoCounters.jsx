import React from 'react';
import createClass from 'create-react-class';
import { Counter, counterInit } from './counter';

let TwoCounters = createClass({
  getInitialState() {
    return { count: counterInit() };
  },
  setCount(newCount) {
    this.setState({ count: newCount });
  },
  render() {
    let counterProps = {
      count: this.state.count,
      setCount: this.setCount,
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