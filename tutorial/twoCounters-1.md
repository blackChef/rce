# Two counters，share state 2

[上一章](https://github.com/blackChef/rce/blob/chinese-doc/tutorial/twoCounters-0.md)

我们喜欢使用组件，因为组件将功能封装在内部，我们不需要了解细节，引入它就可以使用。

我们喜欢开发组件，因为组件化能让我们一次专注于解决一个问题。

我们也喜欢 mvc，因为我们总是会遇到让不同地方渲染相同的状态的场景。

但是之前的章节似乎证明了：一个封装好的组件是没法和其他组件共享状态的。

**让组件把功能封装的同时，又能和其他组件共享状   态** 就是我们接下来要解决的问题。

让我们再来看一下之前的 TwoCounter：

```
let TwoCounters = createClass({
  getInitialState() {
    // 首先可以明确的是，两个 Counter 间共享的 state 必须放在它们的父元素内。
    // 我们之前也讨论过，Counter 之所以能插入即用，跟它能设定自己的默认 state 有关。
    // 那么我们能否将默认 state 交还给 Counter 呢？
    return { count: 0 };
  },

  // increase 和 decrease 之所以写在 TwoCounters 内，是因为 state 保存在 TwoCounters 内。
  // 这里让我们想到了事件委托机制。父元素提供接口，让子元素可以把事件处理函数写在它内部。
  // 父元素其实并不关心子元素的事件函数是怎样的。
  // 那么我们能否效仿事件委托，把 increase 和 decrease 还给 Counter？
  increase() {
    this.setState({ count: this.state.count + 1 });
  },
  decrease() {
    this.setState({ count: this.state.count - 1 });
  },
  render() {
    let counterProps = {
      count: this.state.count,
      increase: this.increase,
      decrease: this.decrease,
    };

    return (
      <div>
        <Counter {...counterProps}/>
        <Counter {...counterProps}/>
      </div>
    );
  },
});
```

### 把 initial state 还给 Counter

把设置默认 state 的任务还给 Counter 的问题很容易解决。只要 Counter 能提供一个返回默认值的函数就行了。
这里也可以看到，如果 TwoCounters，也就是 Counter 的使用者不想要 Counter 提供的默认值，它也可以自行设定其他值。

```diff
+ let counterInit = function() {
+  return 0;
+ };

let Counter = createClass({
  render() {
    return (
      <div>
        <button type="button" onClick={this.props.decrease}>-</button>
        <span>{this.props.count}</span>
        <button type="button" onClick={this.props.increase}>+</button>
      </div>
    );
  },
});
```

```diff
let TwoCounters = createClass({
  getInitialState() {
-   return { count: 0 };
+   return { count: counterInit() };
  },
  increase() {
    this.setState({ count: this.state.count + 1 });
  },
  decrease() {
    this.setState({ count: this.state.count - 1 });
  },
  render() {
    let counterProps = {
      count: this.state.count,
      increase: this.increase,
      decrease: this.decrease,
    };

    return (
      <div>
        <Counter {...counterProps}/>
        <Counter {...counterProps}/>
      </div>
    );
  },
});
```

### 把 controller 还给 Counter

改成下面的代码后，我们可以更清楚的看出 TwoCounters 的任务实际上只是保存 state。
把新增的 setCount 方法传递给 Counter 之后，increase 和 decrease 是怎么实现就完全由 Counter 控制了。

```diff
let counterInit = function() {
  return 0;
};

let Counter = createClass({
+ increase() {
+   this.props.setCount(this.props.count + 1);
+ },
+ decrease() {
+   this.props.setCount(this.props.count - 1);
+ },
  render() {
    return (
      <div>
-       <button type="button" onClick={this.props.decrease}>-</button>
+       <button type="button" onClick={this.decrease}>-</button>
        <span>{this.props.count}</span>
-       <button type="button" onClick={this.props.increase}>+</button>
+       <button type="button" onClick={this.increase}>+</button>
      </div>
    );
  },
});
```

```diff
let TwoCounters = createClass({
  getInitialState() {
    return { count: counterInit() };
  },
+ setCount(newCount) {
+   this.setState({ count: newCount });
+ },
- increase() {
-   this.setState({ count: this.state.count + 1 });
- },
- decrease() {
-   this.setState({ count: this.state.count - 1 });
- },
  render() {
    let counterProps = {
      count: this.state.count,
+     setCount: this.setCount,
-     increase: this.increase,
-     decrease: this.decrease,
    };

    return (
      <div>
        <Counter {...counterProps}/>
        <Counter {...counterProps}/>
      </div>
    );
  },
});
```

通过把 init 和 controller 还给 Counter，TwoCounters 可以不用去关心 Counter 的具体实现。现在 Counter 和 TwoCounters 的关系是这样的：

- Counter 需要提供 init 方法，TwoCounters 可以选择用它来给 Counter 设定默认值，也可以自己设定其他值。
- Counter 把 increase 和 decrease 封装在组件里。TwoCounters 不需要关心功能是怎么实现的。
- TwoCounters 需要替 Counter 保存所需的 state：state.count。
- TwoCounters 需要为 Counter 提供修改 state.count 的方法。

现在如果另一个使用者想使用我们的 Counter 组件，他要做的就是在他的 state 内保存 count，并提供 setCount 方法。

[下一章](https://github.com/blackChef/rce/blob/chinese-doc/tutorial/twoCounters-2.md)
