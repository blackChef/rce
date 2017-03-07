import React from 'react';
import ReactDOM from 'react-dom';
import uncontrolled from 'main/createModelHolder';
import { Router, Route, IndexRoute, Link, IndexLink, hashHistory } from 'react-router';
import { view as counter, init as counterInit } from 'components/counter';
import { view as checkbox, init as checkboxInit } from 'components/checkbox';
import { view as checkboxGroup_single, init as checkboxGroup_singleInit } from 'components/checkboxGroup_single';
import { view as threeCounters, init as threeCountersInit } from 'components/threeCounters';
import { view as counterList, init as counterListInit } from 'components/counterList';
import { view as shoppingCart, init as shoppingCartInit } from 'components/shoppingCart';
import { view as test, init as testInit } from 'components/test';

let _counter = uncontrolled(counter, counterInit);
let _checkbox = uncontrolled(checkbox, checkboxInit);
let _checkboxGroup_single = uncontrolled(checkboxGroup_single, checkboxGroup_singleInit);
let _threeCounters = uncontrolled(threeCounters, threeCountersInit);
let _counterList = uncontrolled(counterList, counterListInit);
let _shoppingCart = uncontrolled(shoppingCart, shoppingCartInit);

let App = function({ children }) {
  return (
    <div>
      <nav className="pageNav">
        <IndexLink activeClassName="link_active" to="/">home</IndexLink>
        <Link activeClassName="link_active" to="/counter">counter</Link>
        <Link activeClassName="link_active" to="/checkbox">checkbox</Link>
        <Link activeClassName="link_active" to="/checkboxGroup_single">checkboxGroup_single</Link>
        <Link activeClassName="link_active" to="/threeCounters">threeCounters</Link>
        <Link activeClassName="link_active" to="/counterList">counterList</Link>
        <Link activeClassName="link_active" to="/shoppingCart">shoppingCart</Link>
        <Link activeClassName="link_active" to="/test">test</Link>
      </nav>

      <main className="pageMain">
        {children}
      </main>
    </div>
  );
};


let Home = function() {
  return <h1>welcome</h1>;
};

ReactDOM.render(
  <Router history={hashHistory}>
    <Route path="/" component={App}>
      <IndexRoute component={Home} />
      <Route path="/counter" component={_counter}></Route>
      <Route path="/checkbox" component={_checkbox}></Route>
      <Route path="/checkboxGroup_single" component={_checkboxGroup_single}></Route>
      <Route path="/threeCounters" component={_threeCounters}></Route>
      <Route path="/counterList" component={_counterList}></Route>
      <Route path="/shoppingCart" component={_shoppingCart}></Route>
      <Route path="/test" component={test}></Route>

    </Route>
  </Router>,
  document.querySelector('.appContainer')
);

import Perf from 'react-addons-perf';
window.Perf = Perf;