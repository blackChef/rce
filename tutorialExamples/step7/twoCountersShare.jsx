import React from 'react';
import createClass from 'create-react-class';
import { Counter, counterInit } from './counter';
import Cortex from 'cortexjs';

let TwoCountersShare = createClass({
  getInitialState() {
    let initModelVal = {
      count: counterInit()
    };
    let onModelUpdate = newModel => this.setState({ model: newModel });
    let initModel = new Cortex(initModelVal, onModelUpdate);
    return { model: initModel };
  },
  render() {
    return (
      <div>
        <Counter model={this.state.model.count} />
        <Counter model={this.state.model.count} />
      </div>
    );
  },
});

export default TwoCountersShare;