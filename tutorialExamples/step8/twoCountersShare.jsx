import React from 'react';
import createClass from 'create-react-class';
import { Counter, counterInit } from './counter';
import createModelHolder from './createModelHolder';


let TwoCountersShareInit = function() {
  return {
    count: counterInit()
  };
};

let TwoCountersShare = createClass({
  render() {
    return (
      <div>
        <Counter model={this.props.model.count} />
        <Counter model={this.props.model.count} />
      </div>
    );
  },
});

TwoCountersShare = createModelHolder(TwoCountersShare, TwoCountersShareInit());

export default TwoCountersShare;