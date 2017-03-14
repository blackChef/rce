import React from 'react';
import isFunction from 'lodash/fp/isFunction';
import Cortex from 'cortexjs';

export default function(Component, initialValue) {
  let container = React.createClass({
    displayName: `@ModelHolder_${Component.displayName}`,

    getInitialState() {
      let _initialValue = isFunction(initialValue)? initialValue() : initialValue;

      let initialModel = new Cortex(_initialValue, newModel => {
        if (this.isMounted) {
          this.setState({ model: newModel });
        }
      });

      this.isMounted = true;

      return { model: initialModel };
    },

    componentWillUnmount() {
      this.isMounted = false;
    },

    render() {
      return <Component model={this.state.model} {...this.props} />;
    }
  });

  return container;
};

