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

// use map lookup
let actions = {
  // { payload, model, dispatch, getLatestModel }
  getData({ model, getLatestModel }) {
    model.requestStatus.set('loading');
    fakeApiCalls.getOrder().then(function(res) {
      let { products } = res;
      let latestModel = getLatestModel();
      latestModel.requestStatus.set('success');
      latestModel.products.set(products);
      latestModel.isContentReady.set(true);
    });
  },

  saveData({ model, getLatestModel }) {
    model.requestStatus.set('loading');

    let { products } = model.val();

    fakeApiCalls.confirmOrder({ products })
      .then(function() {
        let latestModel = getLatestModel();
        latestModel.requestStatus.set('success');
      });
  },
};

let update = function(props) {
  let { type, ...otherProps } = props;
  actions[type](otherProps);
};

let Loading = createComponent({
  view({ model }) {
    let requestStatus = model.requestStatus.val();
    if (requestStatus !== 'success') {
      return <h5>{requestStatus}</h5>;
    }

    return null;
  }
});

let Item = createComponent({
  view({ name, count, price }) {
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
  }
});

let Footer = createComponent({
  view({ model }) {
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
  }
});

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
    let items = model.products.map(function(item, index) {
      return <Item key={index} {...item}/>;
    });

    return (
      <div>
        <Loading model={model}/>
        {
          model.isContentReady.val() &&
          <form onSubmit={this.onSubmit}>
            <section className="section">
              {items}
            </section>
            <Footer model={model}/>
          </form>
        }
      </div>
    );
  },
});


view = createComponent({ name, update, view });
export { init, view };
