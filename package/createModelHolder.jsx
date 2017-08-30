import React from 'react';
import createClass from 'create-react-class';
import getVal from './getVal';
import createModel from './cursor';

export default function(Component, initialValue) {
  let container = createClass({
    displayName: `@ModelHolder_${Component.displayName}`,

    getInitialState() {
      this.model = createModel(
        getVal(initialValue),
        newModel => this.setState({ model: newModel })
      );

      return { model: this.model };
    },

    componentWillUnmount() {
      this.model.unListen();
    },

    render() {
      return <Component {...this.props} model={this.state.model} />;
    }
  });

  return container;
};

