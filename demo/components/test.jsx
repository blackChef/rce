import React from 'react';
import createClass from 'create-react-class';
import createComponent from '../../package/createComponent';
import uncontrolled from '../../package/createModelHolder';
import forEach from '../../package/array/forEach';
import { view as Counter, init as counterInit } from './counter';

let Inner = createComponent({
  name: 'Inner',
  view(props) {
    // console.log('render inner');
    return null;
  }
});

let name = 'test';

let init = function() {
  return [1,2,3,4,5];
};

let update = function({ type, payload, model, dispatch }) {};

let view = createClass({
  getInitialState() {
    return { time: 0 };
  },

  componentDidMount() {
    let { model } = this.props;

    forEach(model, function(i) {
      console.log(i.val());
    });

    // setInterval(() => {
    //   this.setState({ time: Date.now() });
    // }, 1000);
  },

  render() {
    let { model } = this.props;
    console.log(model.val());
    return (
      <div>
        <Inner foo={model} cursorProps={['foo']}/>
      </div>
    );
  },
});


view = createComponent({ name, update, view });
view = uncontrolled(view, init());
export { init, view };

