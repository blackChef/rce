import React from 'react';
import createComponent from '../../package/createComponent';
import uncontrolled from '../../package/createModelHolder';
import { view as Counter, init as counterInit } from './counter';

let Inner = createComponent({
  name: 'Inner',
  view(props) {
    // console.log('render inner');
    console.log(props);
    return null;
  }
});

let name = 'test';

let init = function() {
  return [1,2,3,4,5];
};

let update = function({ type, payload, model, dispatch }) {};

let view = React.createClass({
  getInitialState() {
    return { time: 0 };
  },

  componentDidMount() {
    // setInterval(() => {
    //   this.setState({ time: Date.now() });
    // }, 1000);
  },

  render() {
    let { model } = this.props;
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

