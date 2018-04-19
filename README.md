# rce

rce 代表 react, data cursor, elm。是一个轻量级的 react 架构。它有以下几个特点:

- 它是一个 react 架构。仅有两个 api。设计思路与 react 一致。会 react 就能快速上手 rce。
- 它利用数据指针，让组件的 model(state) 和 model management 存在与组件中，但又能享受不同组件共享 model 带来的好处。
- 受 elm 启发。将组件的 initial model，组件 model 的 update，组件的 render，分为 init，update，view 三个清晰的部分。

# CortexJs
> Cortex is an immutable data store for managing deeply nested structure with React

https://github.com/mquan/cortex

rce 采用 cortexjs 实现的数据指针。

考虑 `model = { a: { foo: 5 }, b: 5 }` 这样一个数据。  
在创建成 cortex 数据之后，要修改 `model.a.foo` 的值。我们这么做：`model.a.foo.set(10)`。  
要读取 `model.a.foo` 的值，我们这么做：`model.a.foo.val()`


# Live demos
实例：https://blackchef.github.io/rce/  
代码: https://github.com/blackChef/rce/tree/master/demo/components

# Install
npm install rce-pattern --save  
yarn add rce-pattern

# Quick Start
## A Counter

    import React from 'react';
    import createComponent from 'rce-pattern/createComponent';
    
    // name 用作 component 的 display name。有利于调试，但并不是必须的。
    let name = 'counter'; 
    
    // init 是一个函数，返回这个组件的初始状态。
    let init = function() { 
      return 0; // count
    };
    
    // update 是一个函数。在这里处理对组件状态的更新。
    // 组件在其内部调用 dispatch(type, payload) 来触发 action。action 在 update 内被处理。
    // type: String。action 的类型。
    // payload: Any。dispatch 发来的信息。
    // model: Cortex Cursor。update 执行时，组件内的 model。
    // dispatch: Function。可以在 update 内 dispatch 其他 action。
    // getLastetModel: Function。获取组件最新的 model。在异步处理的 callback 内应该用它来获取最新的 model。
    let update = function({ type, payload, model, dispatch, getLatestModel }) {
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
    export { init, view };




