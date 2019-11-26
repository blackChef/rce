import React from 'react';
import createClass from 'create-react-class';
import createComponent from 'rce-pattern/createComponent';
import omit from 'lodash/omit';

const defaultResolveEvent = function(event) {
  return event.target.value;
};


// adapt a "value, onChange" pattern component to rce's model pattern
const rceAdaptor = function(
  Component,
  defaultVal = null,
  resolveOnChange = defaultResolveEvent
) {
  const name = Component.name;

  const init = function() {
    return defaultVal;
  };

  let view = createClass({
    onChange(e) {
      const val = resolveOnChange(e);
      this.props.model.set(val);
    },
    render() {
      const otherProps = omit(this.props, [
        'model', 'dispatch', 'dispatcher'
      ]);
      return (
        <Component
          {...otherProps}
          value={this.props.model.val()}
          onChange={this.onChange}
        />
      );
    },
  });

  view = createComponent({ name, view });
  return { init, view };
};

export default rceAdaptor;