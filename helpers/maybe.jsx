import either from './either.jsx';
import React from 'react';

let Null =  React.createClass({
  displayName: 'Null',
  render() {
    return null;
  },
});

export default function(condition, componentClass) {
  return either(condition, componentClass, Null);
};