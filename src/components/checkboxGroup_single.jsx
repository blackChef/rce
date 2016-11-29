import React from 'react';
import createComponent from 'helpers/createComponent.jsx';
import range from 'lodash/range';
import curry from 'lodash/curry';
import { createProxyCursor } from 'dataCursor/index.jsx';
import { view as Checkbox } from './checkbox.jsx';

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
  let curIsChecked = index == model.val();
  let onToggle = newIsChecked => dispatch('toggle', { index, newIsChecked });
  let checkboxModel = createProxyCursor(curIsChecked, onToggle);
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
