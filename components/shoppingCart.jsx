import React from 'react';
import createComponent from 'helpers/createComponent.jsx';
import { view as Checkbox } from 'components/checkbox.jsx';
import { view as Counter } from 'components/counter.jsx';



let getOrder = function() {
  return new Promise(function(resolve, reject) {
    setTimeout(function() {
      resolve({
        agreeToSomething: true,
        products: [
          { name: 'apple', count: 1, price: 3, },
          { name: 'banana', count: 3, price: 5, },
        ],
      });
    }, 500);
  });
};

let updateOrder = function(data) {
  return new Promise(function(resolve, reject) {
    setTimeout(function() {
      resolve();
    }, 500);
  });
};


let name = 'shoppingCart';

let init = function() {
  return {
    requestStatus: '', // loading, error, success
    isContentReady: false,
    agreeToSomething: false,
    products: [
      // { name: 'apple', count: 1, price: 3 },
    ],
  };
};

let update = function(props, component) {
  let { type, payload, dispatch } = props;


  // use actions map, cleaner than if..else
  let actions = {
    getData() {
      props.model.requestStatus.set('loading');


      getOrder().then(function(res) {
        props.model.requestStatus.set('success');

        // pick data from response
        let { agreeToSomething, products } = res;

        props.model.agreeToSomething.set(agreeToSomething);
        props.model.products.set(products);
        props.model.isContentReady.set(true);
      });
    },

    saveData() {
      props.model.requestStatus.set('loading');

      // pick data from model
      let { agreeToSomething, products } = props.model.val();

      updateOrder({ agreeToSomething, products }).then(function(res) {
        props.model.requestStatus.set('success');
      });
    },
  };
  actions[type]();
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
    let { model, dispatch } = this.props;
    let items = model.products.toArray().map(function({ name, count, price }) {
      return (
        <div key={name.val()} style={{ display: 'flex', marginBottom: '15px' }}>
          <span style={{ marginRight: '10px' }}>{name.val()}</span>

          <Counter model={count} />

          <span style={{ marginLeft: '10px' }}>${count.val() * price.val()}</span>
        </div>
      );
    });

    let requestStatus = model.requestStatus.val();

    let renderRequestStatus = function() {
      if (requestStatus != 'success') {
        return <div className="infoBanner">{requestStatus}</div>;
      }
    };

    let renderContent = function() {
      if (model.isContentReady.val()) {
        return (
          <form onSubmit={this.onSubmit}>
            <section className="section">
              {items}
            </section>

            <section className="section">
              <Checkbox label="agree to something" model={model.agreeToSomething}/>
              <div style={{ marginTop: '15px' }}>
                <button
                  disabled={model.requestStatus.val() == 'loading'}
                  type="submit"
                >
                  confirm order
                </button>
              </div>
            </section>
          </form>
        );
      }
    }.bind(this);

    return (
      <div>
        {renderRequestStatus()}
        {renderContent()}
      </div>
    );
  },
});


view = createComponent({ name, update, view });
export { name, init, view };
