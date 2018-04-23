import React from 'react';
import ReactDOM from 'react-dom';
import uncontrolled from '../package/createModelHolder';
import { view as counter, init as counterInit } from './components/counter';
import { view as threeCounters, init as threeCountersInit } from './components/threeCounters';
import { view as counterList, init as counterListInit } from './components/counterList';
import { view as shoppingCart, init as shoppingCartInit } from './components/shoppingCart';
import { NavLink as Link, Route, Switch, HashRouter } from 'react-router-dom';


let _counter = uncontrolled(counter, counterInit);
let _threeCounters = uncontrolled(threeCounters, threeCountersInit);
let _counterList = uncontrolled(counterList, counterListInit);
let _shoppingCart = uncontrolled(shoppingCart, shoppingCartInit);

let App = function({ children }) {
  return (
    <div>
      <nav className="pageNav">
        <Link exact activeClassName="link_active" to="/">home</Link>
        <Link exact activeClassName="link_active" to="/counter">counter</Link>
        <Link exact activeClassName="link_active" to="/threeCounters">threeCounters</Link>
        <Link exact activeClassName="link_active" to="/counterList">counterList</Link>
        <Link exact activeClassName="link_active" to="/shoppingCart">shoppingCart (async action)</Link>
      </nav>

      <main className="pageMain">
        <Switch>
          <Route exact path="/counter" component={_counter}></Route>
          <Route exact path="/threeCounters" component={_threeCounters}></Route>
          <Route exact path="/counterList" component={_counterList}></Route>
          <Route exact path="/shoppingCart" component={_shoppingCart}></Route>
        </Switch>
        {children}
      </main>
    </div>
  );
};




ReactDOM.render(
  <HashRouter>
    <App/>
  </HashRouter>,
  document.querySelector('.appContainer')
);
