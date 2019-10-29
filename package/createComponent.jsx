import React from 'react';
import createClass from 'create-react-class';
import isFunction from 'lodash/isFunction';
import defaultShouldComponentUpdate from './shouldComponentUpdate';
import omit from 'lodash/omit';
import memoize from 'shallow-memoize';


const extractCursorProps = function(cursorPropNames, otherProps) {
  if (!cursorPropNames) {
    return otherProps;
  }

  const extractedProps = cursorPropNames.reduce(function(preVal, key) {
    const maybeCursor = otherProps[key];

    const val = ( maybeCursor !== undefined && isFunction(maybeCursor.val) ) ?
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

const createComponent = function(props) {
  const {
    name = '',
    view: View,
    update,
    shouldComponentUpdate: customShouldComponentUpdate,
  } = props;

  // overwrite component name
  View.displayName = name;

  const Component = createClass({
    // "@" means it's a hoc/decorator
    displayName: `@RCE_${name}`,

    dispatch(type, payload) {
      if (!update) return;
      // Model mutation is async, like react state.
      // Inside update function, we loose reference after model updated.
      // If we want to access latest model, we have to request `component.props.model`.
      // We don't make model a getter here, because getter is only called when we do `object.getter`.
      // If we do destruction at first: `let { getter } = props`, the getter is a static value,
      // which can be a confusing behavior.
      const { dispatch, props: { model } } = this;
      const getModel = () => this.props.model;
      update({
        type, payload, dispatch,
        model, getModel, getLatestModel: getModel, getNewModel: getModel,
      });
    },

    initDispacher() {
      const component = this;

      // `dispatcher` is a function that return a function which will call dipatch.
      // The second argument can be an undefined, a function or a constant.
      // Because `dispatcher` is memoized. Using `dispatcher`
      // rather than `() => dispatch(type)` in render function can be performance beneficial.
      const dispatcher = function(type, arg) {
        if (arg === undefined) {
          return function(payload) {
            component.dispatch(type, payload);
          };
        }

        // If arg is a function. That function should return a resolved payload.
        if (isFunction(arg)) {
          return function(payload) {
            const resolvedPayload = arg(payload, component.props);
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

    UNSAFE_componentWillMount() {
      this.initDispacher();
      this.initShouldComponentUpdate();
    },

    render() {
      const {
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

