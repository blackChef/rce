import React from 'react';
import ReactDOM from 'react-dom';
import createModelHolder from './step8/createModelHolder';
import { view as _App, init } from './step11/counter';

let App = createModelHolder(_App, init());

ReactDOM.render(
  <App />,
  document.querySelector('.appContainer')
);