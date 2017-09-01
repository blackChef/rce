import React from 'react';
import createClass from 'create-react-class';
import getVal from './getVal';
import createModel from './cursor';

export default function(Component, initialValue) {
  let container = createClass({
    displayName: `@ModelHolder_${Component.displayName}`,

    getInitialState() {
      let _initialValue;

      // If model is supplied, we use that model's value as initialValue,
      // allow parent change child's model
      if (this.props.model !== undefined) {
        _initialValue = this.props.model.val();
      } else {
        _initialValue = getVal(initialValue);
      }


      this.model = createModel(
        _initialValue,
        newModel => {
          this.setState({ model: newModel });
          if (this.props.onModelChange) {
            this.props.onModelChange(newModel);
          }
        }
      );

      return { model: this.model };
    },

    componentWillUnmount() {
      this.model.unListen();
    },

    componentWillReceiveProps(nextProps) {
      // Create a traditional uncontrolled component behavior:
      // Parent can change child's model, and receive new model in a callback
      if (
          nextProps.model !== undefined &&
          nextProps.model !== this.props.model
      ) {
        this.state.model.set(
          nextProps.model.val()
        );
      }
    },

    render() {
      let { onModelChange, model, ...otherProps } = this.props;
      return <Component {...otherProps} model={this.state.model} />;
    }
  });

  return container;
};

