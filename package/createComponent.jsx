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
    displayName: `@RCE_${componentName}`,

    dispatch(type, payload) {
      // model mutation is async, like react state
      // inside component's update function, we loose reference after model updated
      let component = this;
      let args = {
        type, payload,
        dispatch: component.dispatch,
        currentModel: component.props.model,
        model: component.props.model, // alias
        getLatestModel() {
          return component.props.model;
        }
      };

      update(args, component);
    },

    componentWillMount() {
      // dispatcher returns function that apply dispatch.
      // it's useful for creating stateless react components.
      let component = this;
      let dispatcher = function(type, payloadResolver = a => a) {
        return function(event) {
          let payload = payloadResolver(event, component.props);
          component.dispatch(type, payload);
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
      let otherProps = omit(['constantProps', 'variableProps'], this.props);

      // order is important here
      // if component receive "dispatch" or "dispatcher" as props,
      // we should overwrite them
      return React.createElement(view, {
        ...otherProps, dispatch, dispatcher,
      });
    },
  });


  return component;
};

