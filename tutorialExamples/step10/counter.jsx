import React from 'react';
import createClass from 'create-react-class';
import shallowEqual from '../../package/shallowEqual';

let init = function() {
  return {
    count: 0,
    loadingStatus: ''
  };
};

let fakeAsyncCall = function() {
  return new Promise(function(resolve) {
    setTimeout(resolve, 1000);
  });
};

let update = function({ type, model, payload, getLastetModel }) {
  if (type === 'increase') {
    model.count.set(model.count.val() + payload);
  }

  else if (type === 'decrease') {
    model.count.set(model.count.val() - payload);
  }

  else if (type === 'submit') {
    model.loadingStatus.set('loading');
    fakeAsyncCall().then(function() {
      getLastetModel().loadingStatus.set('success');
    });
  }
};

let view = createClass({
  displayName: 'Counter',
  getLastetModel() {
    return this.props.model;
  },
  shouldComponentUpdate(nextProps) {
    return !shallowEqual(this.props, nextProps);
  },
  dispatch(type, payload) {
    let { model } = this.props;
    let { getLastetModel } = this;
    update({ type, model, payload, getLastetModel });
  },
  render() {
    let isLoading = this.props.model.loadingStatus.val() === 'loading';
    return (
      <div>
        <button type="button" onClick={() => this.dispatch('decrease', 1)}>-</button>
        <span>{this.props.model.count.val()}</span>
        <button type="button" onClick={() => this.dispatch('increase', 1)}>+</button>

        <button type="button" onClick={() => this.dispatch('increase', 10)}>+10</button>

        <button type="button"
          onClick={() => this.dispatch('submit')}
          disabled={isLoading}
        >
          { isLoading ? 'loading' : 'submit' }
        </button>
      </div>
    );
  },
});

export { view, init };