import React from 'react';
import createComponent from '../../package/createComponent';
import range from 'lodash/range';
import curry from 'lodash/curry';
import createProxyModel from '../../package/createProxyModel';
import { view as Checkbox } from './checkbox';

let name = 'checkboxGroup_single';

let init = function() {
  return -1; // index of checked checkbox
};

let update = function({ type, payload, model, dispatch }) {
  let { index, newIsChecked } = payload;
  if (newIsChecked) {
    model.set(index);
  } else {
    model.set(-1);
  }
};

let renderCheckbox = curry(function(model, dispatch, index) {
  let curIsChecked = index === model.val();
  let onToggle = newIsChecked => dispatch('toggle', { index, newIsChecked });
  let checkboxModel = createProxyModel(curIsChecked, onToggle);

  return (
    <div key={index}>
      <Checkbox model={checkboxModel} label={index} />
    </div>
  );
});

let view = function({ model, dispatch }) {
  let checkboxList = range(5).map(renderCheckbox(model, dispatch));
  return <div>{checkboxList}</div>;
};

view = createComponent({ name, update, view });
export { name, init, view };
