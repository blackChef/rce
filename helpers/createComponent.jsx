import React from 'react';
import shallowEqual from './shallowEqual.jsx';
import omit from 'lodash/fp/omit';
import pick from 'lodash/fp/pick';
import memoize from 'lodash/memoize';
import identity from 'lodash/identity';

export default function({ name = '', update = () => {}, view }) {
  let component = React.createClass({
    displayName: `wrapper_${name}`,

    dispatch(type, payload, updateUntilNextTick = false) {
      // cortex model is async, like react state
      // inside update, we loose reference after model updated
      // define model as a getter, so that update can accesss right model reference
      let component = this;
      let args = {
        type, payload,
        dispatch: component.dispatch,
        get model() {
          return component.props.model;
        },
      };

      if (updateUntilNextTick) {
        component.updateQueue.push( () => update(args, component) );
      } else {
        update(args, component);
      }
    },

    componentWillMount() {
      this.updateQueue = [];
      this.dispatcher = memoize((type, mapper = identity) => {
        return payload => this.dispatch(type, mapper(payload));
      });
    },

    componentDidUpdate(prevProps) {
      // after model updated, execute dispatches inside updateQueue
      if (prevProps.model !== this.props.model) {
        if (this.updateQueue.length) {
          this.updateQueue.forEach( item => item() );
          this.updateQueue = [];
        }
      }
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

      view.displayName = name;

      return React.createElement(view, {
        dispatch, dispatcher, ...otherProps
      });
    },
  });


  return component;
};

