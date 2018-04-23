import Cortex from 'cortexjs';
import React from 'react';
import createClass from 'create-react-class';

let createModelHolder = function(Component, initModelVal) {
  return createClass({
    getInitialState() {
      let onModelUpdate = newModel => this.setState({ model: newModel });
      let initModel = new Cortex(initModelVal, onModelUpdate);
      return { model: initModel };
    },
    render() {
      return <Component model={this.state.model} />;
    },
  });
};

export default createModelHolder;