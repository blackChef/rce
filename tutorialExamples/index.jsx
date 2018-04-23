import React from 'react';
import ReactDOM from 'react-dom';
import createModelHolder from './step8/createModelHolder';
import { view as TwoCounters, init as twoCountersInit } from './step9/twoCountersNoShare';

let App = createModelHolder(TwoCounters, twoCountersInit());

ReactDOM.render(
  <App />,
  document.querySelector('.appContainer')
);