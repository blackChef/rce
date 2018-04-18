import React from 'react';
import createClass from 'create-react-class';
import createComponent from '../../package/createComponent';
import { view as Counter } from './counter';

let fakeApiCalls = {
  getOrder() {
    return new Promise(function(resolve, reject) {
      setTimeout(function() {
        resolve({
          products: [
            { name: 'apple', count: 1, price: 3, },
            { name: 'banana', count: 3, price: 5, },
          ],
        });
      }, 1000);
    });
  },

  confirmOrder(data) {
    return new Promise(function(resolve, reject) {
      setTimeout(resolve, 1000);
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

  // use map lookup
  let actions = {
    getData() {
      model.requestStatus.set('loading');
      fakeApiCalls.getOrder().then(function(res) {
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

      fakeApiCalls.confirmOrder({ products })
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
    return <h5>{requestStatus}</h5>;
  }
};

let renderItem = function({ name, count, price }) {
  return (
    <div key={name.val()} style={{ display: 'flex', marginBottom: '15px' }}>
      <div style={{ marginRight: '10px' }}>{name.val()}</div>
      <div style={{ marginRight: '10px' }}>${price.val()}</div>
      <div style={{ marginRight: '10px' }}>
        <Counter model={count} />
      </div>
      <div>${count.val() * price.val()}</div>
    </div>
  );
};

let renderFooter = function(model) {
  let requestStatus = model.requestStatus.val();
  let total = model.products.val()
    .reduce(function(preVal, { price, count }) {
      return preVal + price * count;
    }, 0);

  return (
    <footer>
      <div>total: ${total}</div>
      <div style={{ marginTop: '15px' }}>
        <button
          disabled={requestStatus === 'loading'}
          type="submit"
        >
          confirm order
        </button>
      </div>
    </footer>
  );
};

let renderContent = function(model, onSubmit) {
  if (model.isContentReady.val()) {
    return (
      <form onSubmit={onSubmit}>
        <section className="section">
          {model.products.map(renderItem)}
        </section>

        {renderFooter(model)}
      </form>
    );
  }
};

let view = createClass({
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
