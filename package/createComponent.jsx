import React from 'react';
import shallowEqual from './shallowEqual';
import omit from 'lodash/omit';
import pick from 'lodash/pick';
import memoize from 'lodash/memoize';


export default function({ name = '', update = () => {}, view }) {
  // overwrite component name
  view.displayName = name;

  let component = React.createClass({
    // "@" means it's a hoc/decorator
    displayName: `@RCE_${name}`,

    dispatch(type, payload) {
      let component = this;

      let {
        dispatch,
        props: { model }
      } = component;

      update({
        type, payload, dispatch,
        // model mutation is async, like react state
        // inside update function, we loose reference after model updated.
        // if we want to access latest model,
        // we have to request "component.props.model"
        model,
        getLatestModel: () => component.props.model
      });
    },

    componentWillMount() {
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

      this.dispatcher = memoize(dispatcher);
    },

    shouldComponentUpdate(nextProps) {
      // consumer can specify variableProps and constantProps.
      // variableProps: only these props need to compare.
      // constantProps: these props wont change, dont compare them.
      // if variableProps are defined, ignore contantProps.
      // this is useful for props like children or callback
      let { props: curProps} = this;
      let { variableProps = [], constantProps = [] } = curProps;

      if (variableProps.length) {
        let pickVar = props => pick(props, variableProps);
        return !shallowEqual(pickVar(curProps), pickVar(nextProps));

      } else if (constantProps.length) {
        let omitConst = props => omit(props, [...constantProps, 'constantProps']);
        return !shallowEqual(omitConst(curProps), omitConst(nextProps));

      } else {
        return !shallowEqual(curProps, nextProps);
      }
    },

    render() {
      let { dispatch, dispatcher } = this;
      let { constantProps, variableProps, ...otherProps } = this.props;

      return React.createElement(view, {
        ...otherProps, dispatch, dispatcher,
      });
    },
  });


  return component;
};

