import React from 'react';
import createClass from 'create-react-class';
import isFunction from 'lodash/isFunction';
import defaultShouldComponentUpdate from './shouldComponentUpdate';
import omit from 'lodash/omit';
import memoize from 'shallow-memoize';


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
      let component = this;

      // `dispatcher` is a function that return a function which will call dipatch.
      // The second argument can be an undefined, a function or a constant.
      // Because `dispatcher` is memoized. Using `dispatcher`
      // rather than `() => dispatch(type)` in render function can be performance beneficial.
      let dispatcher = function(type, arg) {
        if (arg === undefined) {
          return function(payload) {
            component.dispatch(type, payload);
          };
        }

        // If arg is a function. That function should return a resolved payload.
        if (isFunction(arg)) {
          return function(payload) {
            let resolvedPayload = arg(payload, component.props);
            component.dispatch(type, resolvedPayload);
          };
        }

        return function() {
          component.dispatch(type, arg);
        };
      };

      this.dispatcher = memoize(dispatcher);
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

