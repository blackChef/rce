import shallowEqual from './shallowEqual';
import deepEqual from 'lodash/isEqual';
import omit from 'lodash/omit';
import pick from 'lodash/pick';

let extractProps = function(props) {
  let {
    // When passing props, only model is a cursor prop for sure.
    // To achieve better performance,
    // component consumer may want to pass other props as cursors.
    // He could pass a cursorProps prop, specify which props are cursors.
    // These props are extracted later in render function.
    cursorProps,

    // Consumer can specify variableProps and constantProps.
    // variableProps: only these props need to shallow compare.
    // constantProps: these props wont change, dont compare them.
    // If variableProps are defined, ignore contantProps.
    // This is useful for props like children or callback
    variableProps: variablePropNames, constantProps: constantPropNames,

    // We only shallow compare first level props by default.
    // Consumer can specify which props should be deep compared.
    deepCompareProps: deepComparePropNames,
    ...otherProps
  } = props;

  let shallowCompareProps = otherProps;
  let deepCompareProps;

  if (deepComparePropNames) {
    shallowCompareProps = omit(otherProps, deepComparePropNames);
    deepCompareProps = pick(otherProps, deepComparePropNames);
  }

  if (variablePropNames) {
    shallowCompareProps = pick(shallowCompareProps, variablePropNames);

  } else if (constantPropNames) {
    shallowCompareProps = omit(shallowCompareProps, constantPropNames);
  }

  return { shallowCompareProps, deepCompareProps };
};

let shouldComponentUpdate = function(curProps, nextProps) {
  let {
    shallowCompareProps: curShallowCompareProps,
    deepCompareProps: curDeepCompareProps
  } = extractProps(curProps);

  let {
    shallowCompareProps: nextShallowCompareProps,
    deepCompareProps: nextDeepCompareProps
  } = extractProps(nextProps);

  let isShallowEqual = shallowEqual(
    curShallowCompareProps,
    nextShallowCompareProps
  );

  if (!isShallowEqual) {
    return true;
  }

  let isDeepEqual = deepEqual(
    curDeepCompareProps,
    nextDeepCompareProps
  );

  return !isDeepEqual;
};


export default shouldComponentUpdate;