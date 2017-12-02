import shallowEqual from './shallowEqual';
import omit from 'lodash/omit';
import pick from 'lodash/pick';
import deepEqual from 'lodash/isEqual';

let shouldComponentUpdate = function(curProps, nextProps) {
  // Consumer can specify variableProps and constantProps.
  // variableProps: only these props need to shallow compare.
  // constantProps: these props wont change, dont compare them.
  // If variableProps are defined, ignore contantProps.
  // This is useful for props like children or callback
  let {
    variableProps = [],
    constantProps = [],
    cursorProps = [],
    deepCompareProps = [],
  } = curProps;

  // When passing props, only model is a cursor prop for sure.
  // To achieve better performance,
  // component consumer may want to pass other props as cursors.
  // He could pass a cursorProps prop, specify which props are cursors.
  // These props are extracted later in render function.
  if (cursorProps.length) {
    nextProps = omit(nextProps, ['cursorProps']);
    curProps = omit(curProps, ['cursorProps']);
  }

  // We only shallow compare first level props by default.
  // Consumer can specify which props should be deep compared.
  let isDeepEqual;
  if (deepCompareProps.length) {
    isDeepEqual = deepCompareProps.find(function(name) {
      return !deepEqual(curProps[name], nextProps[name]);
    }) === undefined;

    nextProps = omit(nextProps, ['deepCompareProps', ...deepCompareProps]);
    curProps = omit(curProps, ['deepCompareProps', ...deepCompareProps]);

  } else {
    isDeepEqual = true;
  }

  let isShallowEqual;
  if (variableProps.length) {
    let pickVar = props => pick(props, variableProps);
    isShallowEqual = shallowEqual(
      pickVar(curProps),
      pickVar(nextProps)
    );

  } else if (constantProps.length) {
    let omitConst = props => omit(props, [...constantProps, 'constantProps']);
    isShallowEqual = shallowEqual(
      omitConst(curProps),
      omitConst(nextProps)
    );

  } else {
    isShallowEqual = shallowEqual(curProps, nextProps);
  }

  return !isShallowEqual || !isDeepEqual;
};


export default shouldComponentUpdate;