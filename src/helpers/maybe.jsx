import either from './either.jsx';
import React from 'react';

let Null =  React.createClass({
  displayName: 'Null',
  shouldComponentUpdate() {
    return false;
  },
  render() {
    return null;
  },
});

export default function(condition, componentClass) {
  return either(condition, Null, componentClass);
};