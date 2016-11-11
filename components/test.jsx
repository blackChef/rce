import React from 'react';
import createComponent from 'helpers/createComponent.jsx';
import uncontrolled from 'helpers/createUncontrolledComponent.jsx';



let name = 'test';

let init = function() {};

let update = function({ type, payload, model, dispatch }) {};

let view = React.createClass({
  render() {
    return (
      <div></div>
    );
  },
});


view = createComponent({ name, update, view });
view = uncontrolled(view, init());
export { init, view };

