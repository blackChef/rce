import React from 'react';
import getVal from './getVal';
import createModel from './cursor';

export default function(Component, initialValue) {
  let container = React.createClass({
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

