import React from 'react';
import createClass from 'create-react-class';
import { Counter, counterInit } from './counter';
import createModel from './createModel';

let TwoCountersNoShare = createClass({
  getInitialState() {
    let initModelVal = {
      countA: counterInit(),
      countB: counterInit(),
    };
    let onModelUpdate = newModel => this.setState({ model: newModel });
    let initModel = createModel(initModelVal, onModelUpdate);
    return { model: initModel };
  },
  render() {
    return (
      <div>
        <Counter model={this.state.model.countA} />
        <Counter model={this.state.model.countB} />
      </div>
    );
  },
});

export default TwoCountersNoShare;