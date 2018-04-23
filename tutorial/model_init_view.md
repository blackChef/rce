# model, init, view

[上一章](https://github.com/blackChef/rce/blob/chinese-doc/tutorial/createModelHolder.md)

- 用数据指针保存 state。
- 用 init 返回 state 的默认值。
- 用 react 组件更新和渲染数据指针保存的 state。

设计架构，就是设计如何开发组件，设计组件间沟通的方式。通过上面的架构，我们成功解决了“共享状态和组件复用矛盾”的问题。

一个好的架构会为架构中的不同部分设置固定的名字。好处是：方便记忆；方便沟通；有个可以遵循的模板。

是时候为我们亲手实现的架构做同样的事情了。我们约定：

- model: 数据指针保存的 state。在我们的架构内，组件获取到的 props.model 总是一个 cortex 形式的数据指针。
- init: 每个组件都应该 export 一个 init 函数。它返回组件需要的默认 model 的值。
- view: 每个组件都应该 export 一个 view 对象。它是一个 react 组件。

按照上面的约定，我们的组件修改成这样：

```
let init = function() {
  return 0;
};

let view = createClass({
  displayName: 'Counter',
  increase() {
    this.props.model.set(this.props.model.val() + 1);
  },
  decrease() {
    this.props.model.set(this.props.model.val() - 1);
  },
  render() {
    return (
      <div>
        <button type="button" onClick={this.decrease}>-</button>
        <span>{this.props.model.val()}</span>
        <button type="button" onClick={this.increase}>+</button>
      </div>
    );
  },
});

export { view, init };
```

```
import { view as Counter, init as counterInit } from './counter';

let init = function() {
  return {
    count: counterInit()
  };
};

let view = createClass({
  displayName: 'TwoCountersShare',
  render() {
    return (
      <div>
        <Counter model={this.props.model.count} />
        <Counter model={this.props.model.count} />
      </div>
    );
  },
});

export { init, view };
```

```
import { view as Counter, init as counterInit } from './counter';

let init = function() {
  return {
    countA: counterInit(),
    countB: counterInit(),
  };
};

let view = createClass({
  displayName: 'TwoCountersNoShare',
  render() {
    return (
      <div>
        <Counter model={this.props.model.countA} />
        <Counter model={this.props.model.countB} />
      </div>
    );
  },
});

export { init, view };
```

[下一章](https://github.com/blackChef/rce/blob/chinese-doc/tutorial/model_init_view_update.md)


