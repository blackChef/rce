import React from 'react';
import shallowEqual from './shallowEqual';
import omit from 'lodash/fp/omit';
import pick from 'lodash/fp/pick';
import memoize from 'lodash/fp/memoize';


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
      // dispatcher returns function that apply dispatch.
      // it's useful for creating stateless react components.
      let component = this;
      let dispatcher = function(type, payloadResolver = a => a) {
        return function(payload) {
          let resolvedPayload = payloadResolver(payload, component.props);
          component.dispatch(type, resolvedPayload);
        };
      };

      // assume payloadResolver is not going to change
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
        let pickVar = pick(variableProps);
        return !shallowEqual(pickVar(curProps), pickVar(nextProps));

      } else if (constantProps.length) {
        let omitConst = omit([...constantProps, 'constantProps']);
        return !shallowEqual(omitConst(curProps), omitConst(nextProps));

      } else {
        return !shallowEqual(curProps, nextProps);
      }
    },

    render() {
      let { dispatch, dispatcher } = this;
      let otherProps = omit([
        'constantProps', 'variableProps',
        'dispatch', 'dispatcher'
      ], this.props);

      return React.createElement(view, {
        ...otherProps, dispatch, dispatcher,
      });
    },
  });


  return component;
};

