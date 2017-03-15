# rce
RCE stands for react-cursor-elm, is a react webapp architecture.

# Install
npm install rce-pattern --save

# Live demos
https://blackchef.github.io/rce/  
All codes can be found here: https://github.com/blackChef/rce/tree/master/demo/components

# Getting start
Create a counter component:

    import createComponent from 'rce-pattern';

    let name = 'counter';

    let init = function() {
      return 0; // count
    };

    let update = function({ type, payload, model, dispatch }) {
      if (type === 'increment') {
        model.set( model.val() + 1 );
      } else {
        model.set( model.val() - 1 );
      }
    };

    let view = function ({ model, dispatcher }) {
      return (
        <div>
          <button type="button" onClick={dispatcher('increment')} >+</button>
          <span>{model.val()}</span>
          <button type="button" onClick={dispatcher('decrement')}>-</button>
        </div>
      );
    };

    view = createComponent({ name, update, view });
    export { name, init, view };
    
Use counter component :

    import createComponent from 'rce-pattern/createComponent';
    import createModelHolder from 'rce-pattern/createModelHolder';
    import { view as Counter, init as counterInit } from 'counter';

    let name = 'app';

    let init = function() {
      return {
        counterModel: counterInit()
      };
    };

    let update = function({ type, payload, model, dispatch }) {};

    let view = function({ model }) {
      return (
        <div>
          <Counter model={model.counterModel}/>
        </div>
      );
    };

    view = createComponent({ name, update, view });
    view = createModelHolder(view, init());
    
    ReactDOM.render...




