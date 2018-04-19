# rce
rce stands for react, data cursor, elm, is a lightweight react architecture.

Features:
- Simple and lightweight. No complex concepts, no complex codes.
- With the help of data cursor(powered by cortexjs), you can have one single model stored at root level, but leave model update inside component itself. 
- init: define initial model. update: handle model update. view: render model. This is the pattern inspired by elm that you will follow to create trully reuseable components.

[中文文档](https://github.com/blackChef/rce/blob/chinese-doc/README.md)

# Data Cursor
Inside rce, data cursor is powered by [cortexjs](https://github.com/mquan/cortex).

> Cortex is an immutable data store for managing deeply nested structure with React

Given data `model = { a: { foo: 5 } }`, after initialized to a cortex data:  
In order to read value from `model.a.foo`, we do `fooValue = model.a.foo.val()`.  
In order to change `model.a.foo` to 10, we do `model.a.foo.set(10)`.   
Updating cortex data is asynchronous and batched. rce will rerender your view when cortex data is updated. It works just like react state.


# Demos
- live demos：https://blackchef.github.io/rce/
- codes used by live demos: https://github.com/blackChef/rce/tree/master/demo/components


# Quick Start

## A Counter

We start by writing a Counter component. [see live example](https://blackchef.github.io/rce/#/counter)

```
import React from 'react';
import createComponent from 'rce-pattern/createComponent';

// The name will be used as component's displayName.
let name = 'counter'; 

// A function that returns component's initial model. 
let init = function() { 
  return 0; // count
};

// A view can create an action by calling dispatch(type, payload).
// An update function will receive that action, and update model.
let update = function({ type, model }) {
  // It's up to you to choose the proper way to handle "too many ifs" problem.
  if (type === 'increment') {
    model.set( model.val() + 1 );
  } else {
    model.set( model.val() - 1 );
  }
};

// A view is a React component. After wrapped by createComponent, 
// it receives model, dispatch, dispatcher three extra props.
// model: Cortex object. It's the state of the component.
// dispatch: Function. dispatch(type, payload). Dispatch an action.
// dispatcher: Function. dispatcher(type, arg). It returns a function that envokes dispatch. 
// dispatcher is usefull when you want to write a functional component.
let view = function ({ model, dispatch, dispatcher }) {
  return (
    <div>
      <button type="button" onClick={dispatcher('increment')} >+</button>
      <span>{model.val()}</span>
      <button type="button" onClick={dispatcher('decrement')}>-</button>
    </div>
  );
};

// createComponent is an HOC。It connects update and view.
view = createComponent({ name, update, view });
export { init, view };
```


## Three Counters
Let's write a component that has three counters where two of them share same model. Of course, we want to reuse our Counter component. [see live example](https://blackchef.github.io/rce/#/threeCounters)

Before we start, let's consider we have a Counter component that store count in its state, and how we can make that component share state with others.

We very likely will use the "dumb component, smart container" approach. We move state, increase, decrease methods into a wrapper component, make our previous stateful Counter component dumb, works as a template.

We want to think in local when we write a component. We also want our result is open for extention and closed for modification. But as we discussed above, in order to share state with others, we modified a fully working component's code. That modified Counter is so dumb that you can't just import it and hope it will work. And what will happen if we want our wrapper component share state with another wrapper component?

Now let's see how rce solves that problem.

```
import React from 'react';
import createComponent from 'rce-pattern/createComponent';
import { view as Counter, init as counterInit } from './counter';

let name = 'threeCounters';

let init = function() {
  return {
    // A parent component can use a child component's init to create the initial model for it. 
    // The parent doesn't need to know anything about the child.
    countA: counterInit(), 
    
    // The parent can also use other value to create child component's initial model.
    countBC: 1,
  };
};


// Because the update lives inside component it self, 
// the parent can just import a component, and that component will work.
// And because a parent can access children's model, it can change children's model if it want.
let update = function({ model }) {
  // We have only one type of action: reset action here.
  model.set( init() ); 
};

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
Eventually, we will store model inside one component's state. That component could be a section, a page, or an app. 
We use `createModelHolder` to do this.

```
import React from 'react';
import ReactDOM from 'react-dom';
import createModelHolder from 'rce-pattern/createModelHolder';
import { view as ThreeCounters, init as threeCountersInit } from './threeCounters';

// createModelHolder(view, arg)
//   if arg is a value, we use that value as component's initial model. 
//   if arg is a function, the return value of that function will be component's initial model.
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
- init: Function. Return initial model.
- update：Function. `update({ type, payload, model, dispatch, getLastetModel })`  
  - type: String. The type of an action.
  - payload: Any. Payload send with an action.
  - model: Cortex data. The current model when update is envoked.
  - dispatch: Function. You can dispatch other actions in update.
  - getLastetModel: Function. Return the latest model. You should use this to get latest model inside async action's callback.
- view: React Component.


## createComponent
`createComponent({ name, view, update })` An HOC function that connnects view and update.
- name: String, optional. The displayName of returned component.
- view: React Component，Required. 
- update: Function, optional。

The view will receive `model`, `dispatch`, `dispatcher` three extra props.
- model：Cortex data.
- dispatch: Function. `dispatch(type, payload)`. Dispatch an action.
  - type: String, required.
  - payload: Any, optional.
- dispatcher: Function. `dispatcher(type, arg)`. Returns a function that envoke dispatch.
  - if arg is undefined, returns `event => dispatch(type, event)`.
  - if arg is a function, returns `event => dispatch(type, arg(event))`.
  - if arg is other value, returns `() => dispatch(type, arg).

## createModelHolder
`createModelHolder(view, arg)`
- if arg is a function, initial model for that view would be arg().
- if arg is a value, initial model for that view would be arg.

