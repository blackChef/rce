import React from 'react';
import shallowEqual from './shallowEqual.jsx';
import omit from 'lodash/fp/omit';
import pick from 'lodash/fp/pick';
import memoize from 'lodash/memoize';

export default function({ name = '', update = () => {}, view }) {
  // make first letter upper case to match react style
  let componentName = [
    name[0].toUpperCase(),
    name.slice(1)
  ].join('');

  view.displayName = componentName;

  let component = React.createClass({
    // "@" indicates it's a hoc/decorator
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
      this.dispatcher = memoize((type, mapper = a => a) => {
        return payload => this.dispatch(type, mapper(payload));
      });
    },

    shouldComponentUpdate(nextProps) {
      // consumer can specify variableProps and constantProps
      // variableProps: only these props need to compare
      // constantProps: these props wont change, dont compare them
      // if variableProps are defined, ignore contantProps
      // this is useful for props like children or callback
      let { variableProps = [], constantProps = [] } = this.props;
      let pickVar = pick(variableProps);
      let omitConst = omit([...constantProps, 'constantProps']);

      let isDifferent = variableProps.length ?
        !shallowEqual(pickVar(this.props), pickVar(nextProps)) :
        !shallowEqual(omitConst(this.props), omitConst(nextProps));

      return isDifferent;
    },

    render() {
      let { dispatch, dispatcher } = this;
      let otherProps = omit(['constantProps', 'variableProps'], this.props);

      // order is important here
      // if component receive "dispatch" or "dispatcher" as prop,
      // we should overwrite them
      return React.createElement(view, {
        ...otherProps, dispatch, dispatcher,
      });
    },
  });


  return component;
};

