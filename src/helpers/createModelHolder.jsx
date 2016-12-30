import React from 'react';
import { initCursor } from 'dataCursor/index.jsx';
import isFunction from 'lodash/isFunction';

export default function(Component, initialValue) {
  let container = React.createClass({
    displayName: `@ModelHolder_${Component.displayName}`,

    getInitialState() {
      let _initialValue = isFunction(initialValue)? initialValue() : initialValue;

      let initialModel = initCursor(_initialValue, newModel => {
        this.setState({ model: newModel });
      });

      this.unListenToModel = initialModel.$unListen;

      return { model: initialModel };
    },

    componentWillUnmount() {
      this.unListenToModel();
    },

    render() {
      return <Component model={this.state.model} {...this.props} />;
    }
  });

  return container;
};

