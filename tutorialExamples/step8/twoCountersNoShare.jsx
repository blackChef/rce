import React from 'react';
import createClass from 'create-react-class';
import { Counter, counterInit } from './counter';
import createModelHolder from './createModelHolder';

let TwoCountersNoShareInit = function() {
  return {
    countA: counterInit(),
    countB: counterInit(),
  };
};

let TwoCountersNoShare = createClass({
  render() {
    return (
      <div>
        <Counter model={this.props.model.countA} />
        <Counter model={this.props.model.countB} />
      </div>
    );
  },
});

TwoCountersNoShare = createModelHolder(TwoCountersNoShare, TwoCountersNoShareInit());

export default TwoCountersNoShare;