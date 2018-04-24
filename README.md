# 问题
- 我们喜欢使用组件，因为组件将功能封装在内部，我们不需要了解细节，引入它就可以使用。
- 我们喜欢开发组件，因为组件化能让我们一次专注于解决一个问题。
- 我们喜欢 mvc 架构，因为我们总是会遇到让不同地方渲染相同的状态的场景。

但一个拥有本地状态，自己能控制状态更新的组件是没法和其他组件共享状态的。

让一个组件能把功能封装，做到即插即用的同时，又能被外界控制，能和其他组件共享状态，就是 rce 解决的问题。


# rce
rce 代表 react, cursor, elm。是一个轻量级的 react 架构。它有以下几个特点:

- 没有复杂的概念，没有复杂的代码。仅有两个 api，设计思路与 react 一致。会 react 就能快速上手 rce。
- 利用数据指针，让你能把组件的 state 保存 app 的最上一层，但又能让将管理 state 的方法写在组件内部。
- 每个组件都按下面的模式划分。 遵循这个受 elm 启发的模式，你就能轻易写出可高度复用的组件。
  - init: 定义组件的默认状态。
  - view: 渲染 model。发布 action。
  - update: 响应 view 传来的 action，修改 model。


[查看这个教程](https://github.com/blackChef/rce/blob/chinese-doc/tutorial/01.md)。了解 rce 的设计理念和实现方式。


# 示例
- 示例：https://blackchef.github.io/rce/
- 示例用到的代码: https://github.com/blackChef/rce/tree/master/demo/components


# 安装
```
npm install rce-pattern --save
```
```
yarn add rce-pattern
```

# 参考

### model, init, view, update
- model: Cortex data。组件的 state 以 cortex data 保存和传递。
- init: Function。返回组件的默认 model 的值。
- view: React Component。
- update：Function。`update({ type, payload, model, dispatch, getLastetModel })`
  - type: String。action 的类型。
  - payload: Any。dispatch 发来的信息。
  - model: Cortex Cursor。update 执行时，组件内的 model。
  - getLastetModel: Function。获取组件最新的 model。在异步处理的 callback 内应该用它来获取最新的 model。
  - dispatch: Function。可以在 update 内 dispatch 其他 action。

### createComponent
`createComponent({ name, view, update })` 一个 HOC，将 view 和 update 串联起来。

- name: String, 非必须。组件的 displayName。有利于调试。
- view: React Component，必须。
- update: Function，非必须。


传入 `createComponent` 的组件收到 `model`, `dispatch`, `dispatcher`,  三个额外的 props。

- model：Cortex data。
- dispatch: Function。`dispatch(type, payload)`。发布一个 action。
  - type: String，必须。
  - payload：Any，非必须。
- dispatcher: Function。`dispatcher(type, arg)`。dispatcher 返回一个执行 dispatch 的函数。
  - arg 为 undefine 时，返回 `event => dispatch(type, event)`。
  - arg 为 Function 时，返回 `event => dispatch(type, arg(event))`。
  - arg 为 其它时，返回 `() => dispatch(type, arg)`。

### createModelHolder
`createModelHolder(view, arg)`
- arg 为函数时，用那个函数返回的值作为 view 的初始 model。
- arg 为其他时，用 arg 作为 view 的初始 model。


# 快速开始

### CortexJs
rce 采用 [cortexjs](https://github.com/mquan/cortex) 实现的数据指针。

> Cortex is an immutable data store for managing deeply nested structure with React

考虑 `model = { a: { foo: 5 }, b: 5 }` 这样一个数据。 在将它创建成 cortex 数据之后：
- 要读取 `model.a.foo` 的值，我们这么做：`fooValue = model.a.foo.val()`。
- 要修改 `model.a.foo` 的值。我们这么做：`model.a.foo.set(10)`。

修改 cortex 数据的操作是异步的。当 cortex 数据更新时，rce 会自动渲染你的 view。就跟 react state 的工作方式一样。

### A Counter
我们来编写一个 Counter 组件。在线例子：https://blackchef.github.io/rce/#/counter

```
import React from 'react';
import createComponent from 'rce-pattern/createComponent';

// name 用作 component 的 displayName， 有利于调试。
let name = 'counter';

// 一个函数，返回这个组件的初始状态。
let init = function() {
  return 0; // count
};

// 组件在其内部调用 dispatch 来发布 action。
// update 函数接收到 action，再根据不同的 action 以不同的方式更新组件的 model。
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
// dispatch(type, payload): dispatch 触发 action。
// dispatcher(type, arg): dispatcher 返回一个执行 dispatch 的函数。 有助于编写 function 形式的 react 组件
let view = function ({ model, dispatch, dispatcher }) {
  return (
    <div>
      <button type="button" onClick={dispatcher('increment')} >+</button>
      <span>{model.val()}</span>
      <button type="button" onClick={dispatcher('decrement')}>-</button>
    </div>
  );
};

// createComponent 将 view，update 二者串联起来。
view = createComponent({ name, update, view });
export { init, view };
```

### Three Counters
现在我们利用之前的 Counter 组件，编写一个包含三个 Counter，其中一个独立，另外两个共享状态的新组件： ThreeCounters。
在线例子：https://blackchef.github.io/rce/#/threeCounters

```
import React from 'react';
import createComponent from 'rce-pattern/createComponent';
import { view as Counter, init as counterInit } from './counter';

let name = 'threeCounters';

let init = function() {
  return {
    // 一个父组件可以用子组件的 init 函数来生成子组件需要的 model。
    // 这时候它不需要管那个子组件需要的 model 是怎样的数据结构，有怎样的值。
    countA: counterInit(),

    // 父组件也能用其他值为子组件设定默认值。
    countBC: 1,
  };
};

// 因为 update 存在于组件自身内部，一个父组件可以简简单单的引入一个组件，那个组件本身就能工作。
// 又因为父组件可以接触到子组件的 model，父组件也可以在父一级对子组件进行控制。
let update = function({ model }) {
  // 只有一种 type 的 action。这时候就没必要对 type 进行判断。
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

### Model Holder
用 createModelHolder 把 model 保存在 state 里。传入 createModelHolder 之后，这个组件失去跟其他组件共享状态的能力。
这个组件可以是一个区块，一个页面，或者是整个 app。

```
import React from 'react';
import ReactDOM from 'react-dom';
import createModelHolder from 'rce-pattern/createModelHolder';
import { view as ThreeCounters, init as threeCountersInit } from './threeCounters';

// createModelHolder(view, init): 把 model 保存在 state 里。
let App = createModelHolder(ThreeCounters, threeCountersInit);

ReactDOM.render(
  <App/>
  document.querySelector('.appContainer')
);

```





