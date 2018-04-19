# rce
rce 代表 react, data cursor, elm。是一个轻量级的 react 架构。它有以下几个特点:

- 它是一个 react 架构。仅有两个 api。设计思路与 react 一致。会 react 就能快速上手 rce。
- 它利用数据指针，让组件的 model(state) 和 model management 存在与组件中，但又能享受不同组件共享 model 带来的好处。
- 受 elm 启发。将组件的 initial model，组件 model 的 update，组件的 render，分为 init，update，view 三个清晰的部分。

[English Document](https://github.com/blackChef/rce/blob/english_doc/README.md)

# CortexJs
> Cortex is an immutable data store for managing deeply nested structure with React

https://github.com/mquan/cortex

rce 采用 cortexjs 实现的数据指针。

考虑 `model = { a: { foo: 5 }, b: 5 }` 这样一个数据。  
在创建成 cortex 数据之后，要修改 `model.a.foo` 的值。我们这么做：`model.a.foo.set(10)`。  
要读取 `model.a.foo` 的值，我们这么做：`fooValue = model.a.foo.val()`


# Demos
- 示例：https://blackchef.github.io/rce/
- 示例用到的代码: https://github.com/blackChef/rce/tree/master/demo/components


# Quick Start

## A Counter

我们来编写一个 Counter 组件。在线例子：https://blackchef.github.io/rce/#/counter

```
import React from 'react';
import createComponent from 'rce-pattern/createComponent';

// name 用作 component 的 display name。有利于调试，但并不是必须的。
let name = 'counter'; 

// init 是一个函数，返回这个组件的初始状态。
let init = function() { 
  return 0; // count
};

// update 是一个函数。在这里处理对组件状态的更新。
// 组件在其内部调用 dispatch 来触发 action。action 在 update 内被处理。
let update = function({ type, model }) {
  // update 只是一个函数。在 type 很多时，可以用各种各样的技巧来解决 too many ifs 的问题。
  if (type === 'increment') {
    // 这里用 set 和 val 两个函数来修改、读取 model 的值。
    model.set( model.val() + 1 );
  } else {
    model.set( model.val() - 1 );
  }
};

// view 是一个 react 组件。被 createComponent wrap 之后，它收到 model, dispatch, dispatcher 三个属性。
// model：Cortex Cursor。组件的 model，理解为组件的 state。
// dispatch: Function。dispatch(type, payload)。dispatch 触发 action，action 在 update 内被处理。
// dispatcher: Function。dispatcher(type, arg)。dispatcher 返回一个执行 dispatch 的函数。
// dispatcher 有助于编写 function 形式的 react 组件。
//   arg 为 undefine 时，返回 event => dispatch(type, event)。
//   arg 为 Function 时，返回 event => dispatch(type, arg(event))。
//   arg 为 其它时，返回 () => dispatch(type, arg)。

let view = function ({ model, dispatch, dispatcher }) {
  return (
    <div>
      <button type="button" onClick={dispatcher('increment')} >+</button>
      <span>{model.val()}</span>
      <button type="button" onClick={dispatcher('decrement')}>-</button>
    </div>
  );
};

// createComponent 是一个 HOC。它将 view，update 二者串联起来。
view = createComponent({ name, update, view });
export { init, view };
```


## Three Counters

现在我们利用之前的 Counter 组件，编写一个包含三个 Counter，其中一个独立，另外两个共享状态的新组件： ThreeCounters。 
在线例子：https://blackchef.github.io/rce/#/threeCounters

我们先考虑如果用 react 的 state 来实现之前的 Counter。

为了让不同组件间能共享状态，同步渲染。state 必须提到上一级父组件内保存和处理。而子组件变成模板，只负责渲染和调用父组件传来的函数。  

编写组件时，我们总是希望能够 thinking in local，希望完成的结果能符合 open close 原则。但这时候我们不仅修改了之前的 Counter。也让 Counter 失去了作为一个组件，把功能封装，引入即可以使用的特性。

如果我们需要 ThreeCounters 再和其他组件共享状态呢？

利用数据指针，状态总是被保存在上一层，再由 prop 传下。而状态的处理逻辑总是保存在组件内部。下面的代码里我们没有对之前的 Counter 做任何修改。

```
import React from 'react';
import createComponent from 'rce-pattern/createComponent';

// 引入之前写的 Counter 的 view 和 init
import { view as Counter, init as counterInit } from './counter';

let name = 'threeCounters';

// 与之前的 Counter 一样。它也有 init 函数。在这个例子里，init 创建的 model 之后会通过 prop 传给 Counter。
let init = function() {
  return {
    // 父组件可以用子组件自己的 init 函数，也可以自行创建其他的默认值。
    // 当父组件想引入一个子组件，直接使用它的功能时。父组件用那个子组件的 init 来生成子组件需要的 model。
    // 它不需要管那个子组件需要的 model 是怎样的数据结构，有怎样的值。
    countA: counterInit(), 
    countBC: 1,
  };
};

// 只有一种 type 的 action。这时候就没必要对 type 进行判断。
// 这里用 init 返回的默认值将 model 设定为初始状态。
let update = function({ model }) {
  model.set( init() ); 
};

// 将 model 的子 model 传给不同的子组件。共享同一子 model 的组件会有相同的渲染。
let view = function ({ model, dispatch, dispatcher }) {
  return (
    <div>
      <section className="section">
        <h4>counterA</h4>
        <Counter model={model.countA} />
      </section>

      <section className="section">
        <h3>counterB and counterC share same model</h3>

        <section>
          <h4>counterB</h4>
          <Counter model={model.countBC} />
        </section>

        <section>
          <h4>counterC</h4>
          <Counter model={model.countBC} />
        </section>
      </section>

      <section className="section">
        <button
          type="button"
          onClick={dispatcher('reset')}
        >
          reset all
        </button>
      </section>
    </div>
  );
};

view = createComponent({ name, update, view });
export { init, view };
```


## Model Holder
最终，我们需要把 model 存在一个组件的 state 里。这个组件可以是一个区块，一个页面，或者是整个 app。用 `createModelHolder` 可以在任何时候将一个 component 变为 model holder。
```
import React from 'react';
import ReactDOM from 'react-dom';
import createModelHolder from 'rce-pattern/createModelHolder';
import { view as ThreeCounters, init as threeCountersInit } from './threeCounters';

// createModelHolder(view, arg)
//   arg 为函数时，用那个函数返回的值作为 view 的初始 model。
//   arg 为其他时，用 arg 作为 view 的初始 model。
let App = createModelHolder(ThreeCounters, threeCountersInit);

ReactDOM.render(
  <App/>
  document.querySelector('.appContainer')
);

```


## Install
npm install rce-pattern --save  
yarn add rce-pattern


# API Reference
## init, update, view
- init: Function。返回组件的默认 model。
- update：Function。`update({ type, payload, model, dispatch, getLastetModel })`  
组件在其内部调用 dispatch(type, payload) 来触发 action。action 在 update 内被处理。
  - type: String。action 的类型。
  - payload: Any。dispatch 发来的信息。
  - model: Cortex Cursor。update 执行时，组件内的 model。
  - dispatch: Function。可以在 update 内 dispatch 其他 action。
  - getLastetModel: Function。获取组件最新的 model。在异步处理的 callback 内应该用它来获取最新的 model。
- view: React Component。


## createComponent
`createComponent({ name, view, update })` 一个 HOC，将 view 和 update 串联起来。

- name: String, 非必须。组件的 display name。有利于调试。
- view: React Component，必须。
- update: Function，非必须。


传入 `createComponent` 的组件收到 `model`, `dispatch`, `dispatcher`,  三个额外的 props。

- model：Cortex Cursor。组件的 model，理解为组件的 state。
- dispatch: Function。`dispatch(type, payload)`。dispatch 触发 action，action 在 update 内被处理。
- dispatcher: Function。`dispatcher(type, arg)`。dispatcher 返回一个执行 dispatch 的函数。
  - arg 为 undefine 时，返回 `event => dispatch(type, event)`。
  - arg 为 Function 时，返回 `event => dispatch(type, arg(event))`。
  - arg 为 其它时，返回 `() => dispatch(type, arg)`。  
  dispatcher 有助于编写 function 形式的 react 组件。

## createModelHolder
`createModelHolder(view, arg)`
- arg 为函数时，用那个函数返回的值作为 view 的初始 model。
- arg 为其他时，用 arg 作为 view 的初始 model。


