import React from 'react';
import createClass from 'create-react-class';
import { Counter, counterInit } from './counter';
import createModel from './createModel';

let TwoCountersShare = createClass({
  getInitialState() {
    let initModelVal = {
      count: counterInit()
    };
    let onModelUpdate = newModel => this.setState({ model: newModel });
    let initModel = createModel(initModelVal, onModelUpdate);
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