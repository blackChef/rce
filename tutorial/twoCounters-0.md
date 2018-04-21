# Two counters, share state

接下来，我们来编写一个新组件。这个组件由两个 Counter 组成。当改变其中一个 Counter 值的时候，另外一个也会同时发生改变。

我们之前已经完成了一个功能完善的 Counter，我们当然想要把它利用起来。现在只要能解决如何让两个 Counter 能同步就行了。

但是很遗憾，如果使用之前的 Counter，我们没办法实现同步的功能。

从 mvc 的角度看，要让不同的组件渲染相同的内容，那些组件应该渲染相同的 model。用 react 的话说，如果我们想让两个 Counter 渲染相同的值，那么它们应该共享相同的 state。但我们之前的 Counter 牢牢控制住自己的 state，不同的 Counter 没办法共享，自然也做不到同步了。

那么如何实现两个 Counter 同步的功能呢？我们只能将 state，increase，decrease 从 Counter 中抽离出来，放到我们新的 TwoCounters 组件内，再将它们以 prop 的形式传递给 Counter。

```
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

let TwoCounters = createClass({
  getInitialState() {
    return { count: 0 };
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

使用上述代码，同步功能是实现了。但之前的 Counter 我们并没有用上。

如果将来需要一个四个 Counter 同步的新组件，现在的 TwoCounters 岂不是又没用了？

[下一章](https://github.com/blackChef/rce/blob/chinese-doc/tutorial/twoCounters-1.md)
