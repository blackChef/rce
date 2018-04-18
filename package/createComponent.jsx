import React from 'react';
import createClass from 'create-react-class';
import pureCalcFunction from './pureCalcFunction';
import isFunction from 'lodash/isFunction';
import defaultShouldComponentUpdate from './shouldComponentUpdate';
import omit from 'lodash/omit';


let extractCursorProps = function(cursorPropNames, otherProps) {
  if (!cursorPropNames) {
    return otherProps;
  }

  let extractedProps = cursorPropNames.reduce(function(preVal, key) {
    let maybeCursor = otherProps[key];

    let val = ( maybeCursor !== undefined && isFunction(maybeCursor.val) ) ?
        maybeCursor.val() :
        maybeCursor;

    return {
      ...preVal,
      [key]: val
    };
  }, {});

  return {
    ...omit(otherProps, cursorPropNames),
    ...extractedProps
  };
};

let createComponent = function(props) {
  let {
    name = '',
    view: View,
    update,
    shouldComponentUpdate: customShouldComponentUpdate,
  } = props;

  // overwrite component name
  View.displayName = name;

  let Component = createClass({
    // "@" means it's a hoc/decorator
    displayName: `@RCE_${name}`,

    dispatch(type, payload) {
      if (!update) return;

      let component = this;

      let {
        dispatch,
        props: { model }
      } = component;

      update({
        type, payload, dispatch,
        // Model mutation is async, like react state.
        // Inside update function, we loose reference after model updated.
        // If we want to access latest model, we have to request `component.props.model`.
        // We don't make model a getter here, because getter is only called when we do `object.getter`.
        // If we do destruction at first: `let { getter } = props`, the getter is a static value,
        // which can be a confusing behavior.
        model,
        getLatestModel: () => component.props.model
      });
    },

    initDispacher() {
      // There are 4 ways to do dispatch in render function:
      // 1. callback = { _ => dispatch(type) }
      // 2. callback = { _ => dispatch(type, constant) }
      // 3. callback = { payload => dispatch(type, resolver(payload)) }
      //    Resolver is pure and constant, lives outside render function
      // 4. callback = { _ => dispatch(type, variableComputedBasedOnComponentProps) }
      //
      // 1,2 can be considered as special cases of 3. 3 can be memoized.
      // Dispatcher is a callback function generator that implement 3.
      let component = this;
      let dispatcher = function(type, payloadResolver = a => a) {
        return function(payload) {
          let resolvedPayload = payloadResolver(payload, component.props);
          component.dispatch(type, resolvedPayload);
        };
      };

      this.dispatcher = pureCalcFunction(dispatcher);
    },

    initShouldComponentUpdate() {
      if (customShouldComponentUpdate) {
        this.shouldComponentUpdate = customShouldComponentUpdate;
      } else {
        this.shouldComponentUpdate = nextProps => {
          return defaultShouldComponentUpdate(this.props, nextProps);
        };
      }
    },

    componentWillMount() {
      this.initDispacher();
      this.initShouldComponentUpdate();
    },

    render() {
      let {
        dispatch,
        dispatcher,
        props: {
          // eslint-disable-next-line no-unused-vars
          constantProps, variableProps, deepCompareProps,
          cursorProps,
          ...otherProps
        },
      } = this;

      return <View
        {...extractCursorProps(cursorProps, otherProps)}
        dispatch={dispatch}
        dispatcher={dispatcher}
      />;
    },
  });

  return Component;
};

export default createComponent;

