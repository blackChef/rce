import React from 'react';
import ReactDOM from 'react-dom';
import uncontrolled from '../package/createModelHolder';
import { view as counter, init as counterInit } from './components/counter';
import { view as checkbox, init as checkboxInit } from './components/checkbox';
import { view as checkboxGroup_single, init as checkboxGroup_singleInit } from './components/checkboxGroup_single';
import { view as threeCounters, init as threeCountersInit } from './components/threeCounters';
import { view as counterList, init as counterListInit } from './components/counterList';
import { view as shoppingCart, init as shoppingCartInit } from './components/shoppingCart';
import { Test } from './components/test';
import { NavLink as Link, Route, Switch, HashRouter } from 'react-router-dom';


let _counter = uncontrolled(counter, counterInit);
let _checkbox = uncontrolled(checkbox, checkboxInit);
let _checkboxGroup_single = uncontrolled(checkboxGroup_single, checkboxGroup_singleInit);
let _threeCounters = uncontrolled(threeCounters, threeCountersInit);
let _counterList = uncontrolled(counterList, counterListInit);
let _shoppingCart = uncontrolled(shoppingCart, shoppingCartInit);
let Home = function() {
  return <h1>welcome</h1>;
};

let App = function({ children }) {
  return (
    <div>
      <nav className="pageNav">
        <Link exact activeClassName="link_active" to="/">home</Link>
        <Link exact activeClassName="link_active" to="/test">test</Link>
        <Link exact activeClassName="link_active" to="/counter">counter</Link>
        <Link exact activeClassName="link_active" to="/threeCounters">threeCounters</Link>
        <Link exact activeClassName="link_active" to="/counterList">counterList</Link>
        <Link exact activeClassName="link_active" to="/shoppingCart">shoppingCart (async action)</Link>
        <Link exact activeClassName="link_active" to="/checkbox">checkbox</Link>
        <Link exact activeClassName="link_active" to="/checkboxGroup_single">checkboxGroup_single (proxy model)</Link>
      </nav>

      <main className="pageMain">
        <Switch>
          <Route exact path="/" component={Home}></Route>
          <Route exact path="/counter" component={_counter}></Route>
          <Route exact path="/checkbox" component={_checkbox}></Route>
          <Route exact path="/checkboxGroup_single" component={_checkboxGroup_single}></Route>
          <Route exact path="/threeCounters" component={_threeCounters}></Route>
          <Route exact path="/counterList" component={_counterList}></Route>
          <Route exact path="/shoppingCart" component={_shoppingCart}></Route>
          <Route path="/test" component={Test}></Route>
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
