import React from 'react';
import isFunction from 'lodash/fp/isFunction';
import createModel from './cursor';

export default function(Component, initialValue) {
  let container = React.createClass({
    displayName: `@ModelHolder_${Component.displayName}`,

    getInitialState() {
      let _initialValue = isFunction(initialValue)?
        initialValue() :
        initialValue;

      this.model = createModel(_initialValue, newModel => {
        this.setState({ model: newModel });
      });

      return { model: this.model };
    },

    componentWillUnmount() {
      this.model.unListen();
    },

    render() {
      return <Component model={this.state.model} {...this.props} />;
    }
  });

  return container;
};

