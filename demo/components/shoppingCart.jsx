import React from 'react';
import createComponent from '../../package/createComponent';
import { view as Counter } from './counter';

let apiCalls = {
  getOrder() {
    return new Promise(function(resolve, reject) {
      setTimeout(function() {
        resolve({
          products: [
            { name: 'apple', count: 1, price: 3, },
            { name: 'banana', count: 3, price: 5, },
          ],
        });
      }, 500);
    });
  },

  updateOrder(data) {
    return new Promise(function(resolve, reject) {
      setTimeout(function() {
        resolve();
      }, 500);
    });
  }
};


let name = 'shoppingCart';

let init = function() {
  return {
    requestStatus: '', // loading, error, success
    isContentReady: false,
    products: [
      // { name: 'apple', count: 1, price: 3 },
    ],
  };
};

let update = function(props) {
  let { type, payload, model, getLatestModel } = props;

  // use map, cleaner than if..else
  let actions = {
    getData() {
      model.requestStatus.set('loading');
      apiCalls.getOrder().then(function(res) {
        let { products } = res;
        let latestModel = getLatestModel();
        latestModel.requestStatus.set('success');
        latestModel.products.set(products);
        latestModel.isContentReady.set(true);
      });
    },

    saveData() {
      model.requestStatus.set('loading');

      let { products } = model.val();

      apiCalls.updateOrder({ products })
        .then(function() {
          let latestModel = getLatestModel();
          latestModel.requestStatus.set('success');
        });
    },
  };
  actions[type]();
};


let renderLoading = function(model) {
  let requestStatus = model.requestStatus.val();
  if (requestStatus !== 'success') {
    return <div className="infoBanner">{requestStatus}</div>;
  }
};

let renderItem = function({ name, count, price }) {
  return (
    <div key={name.val()} style={{ display: 'flex', marginBottom: '15px' }}>
      <span style={{ marginRight: '10px' }}>{name.val()}</span>
      <Counter model={count} />
      <span style={{ marginLeft: '10px' }}>${count.val() * price.val()}</span>
    </div>
  );
};

let renderContent = function(model, onSubmit) {
  if (model.isContentReady.val()) {
    let requestStatus = model.requestStatus.val();
    let items = model.products.map(renderItem);

    return (
      <form onSubmit={onSubmit}>
        <section className="section">
          {items}
        </section>

        <section className="section">
          <div style={{ marginTop: '15px' }}>
            <button
              disabled={requestStatus == 'loading'}
              type="submit"
            >
              confirm order
            </button>
          </div>
        </section>
      </form>
    );
  }
};

let view = React.createClass({
  componentDidMount() {
    this.props.dispatch('getData');
  },

  onSubmit(event) {
    event.preventDefault();
    this.props.dispatch('saveData');
  },

  render() {
    let { model } = this.props;

    return (
      <div>
        {renderLoading(model)}
        {renderContent(model, this.onSubmit)}
      </div>
    );
  },
});


view = createComponent({ name, update, view });
export { name, init, view };
