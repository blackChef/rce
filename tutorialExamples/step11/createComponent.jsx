import React from 'react';
import createClass from 'create-react-class';
import shallowEqual from '../../package/shallowEqual';

let createComponent = function({ name, view: View, update }) {
  return createClass({
    displayName: name,
    getLastetModel() {
      return this.props.model;
    },
    shouldComponentUpdate(nextProps) {
      return !shallowEqual(this.props, nextProps);
    },
    dispatch(type, payload) {
      let { model } = this.props;
      let { getLastetModel } = this;
      update({ type, model, payload, getLastetModel });
    },
    render() {
      return <View {...this.props} dispatch={this.dispatch} />;
    }
  });
};

export default createComponent;