import React from 'react';
import isFunction from 'lodash/isFunction';

export default function(condition, leftClass, rightClass) {
  let getConditionResult = function(props) {
    return isFunction(condition)? condition(props) : condition;
  };

  let component = React.createClass({
    displayName: `@Either_(${leftClass.displayName}/${rightClass.displayName})`,
    render() {
      let { props } = this;

      if (getConditionResult(props)) {
        return React.createElement(rightClass, props);
      } else {
        return React.createElement(leftClass, props);
      }
    },
  });

  return component;
};