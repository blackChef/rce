import React from 'react';
import shallowEqual from './shallowEqual.jsx';
import omit from 'lodash/fp/omit';
import pick from 'lodash/fp/pick';
import memoize from 'lodash/memoize';
import curry from 'lodash/curry';

let setDispatcher = function(dispatch) {
  let ret = memoize(function(type, extracter = any => any) {
    return payload => dispatch(type, extracter(payload));
  });

  return ret;
};

let compareProps_varOnly = curry(function(pickVariableProps, curProps, nextProps) {
  return !shallowEqual(
    pickVariableProps(curProps),
    pickVariableProps(nextProps)
  );
});

let compareProps_withoutConst = curry(function(omitConstantProps, curProps, nextProps) {
  // console.log(curProps.model.b.c === nextProps.model.b.c);
  // console.log(curProps.model, nextProps.model);
  return !shallowEqual(
    omitConstantProps(curProps),
    omitConstantProps(nextProps)
  );
});

export default function({ name = '', update = () => {}, view }) {
  let component = React.createClass({
    displayName: `wrapper_${name}`,

    dispatch(type, payload, updateUntilNextTick = false) {

      // cortex model is async, like react state
      // inside update, we loose reference after model updated
      // define model as a getter, so that update can accesss right model reference

      let component = this;

      let args = {
        type,
        payload,
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
      this.dispatcher = setDispatcher(this.dispatch);

      // consumer can specify variableProps and constantProps
      // variableProps: only these props need to compare
      // constantProps: these props wont change, dont compare them
      // if variableProps are defined, ignore contantProps
      // this is useful for props like children or callback
      // assume variableProps, constantProps dont change
      let { variableProps = [], constantProps = [] } = this.props;
      if (variableProps.length) {
        this.compareProps = compareProps_varOnly( pick(variableProps) );

      } else {
        this.compareProps = compareProps_withoutConst( omit([...constantProps, 'constantProps']) );
      }
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
      let isDifferent = this.compareProps(this.props, nextProps);
      return isDifferent;
    },

    render() {
      let { contantProps, variableProps } = this.props;
      let otherProps = omit(['contantProps', 'variableProps'], this.props);

      let viewProps = Object.assign({
        dispatch: this.dispatch,
        dispatcher: this.dispatcher,
      }, otherProps);

      view.displayName = name;

      return React.createElement(view, viewProps);
    },
  });


  return component;
};

