# createModelHolder

[上一章](https://github.com/blackChef/rce/blob/chinese-doc/tutorial/twoCounters-3.md)

我们再来看一下使用了 cortexjs 之后的代码：

```
let TwoCountersNoShare = createClass({
  getInitialState() {
    let initModelVal = {
      count: counterInit()
    };
    let onModelUpdate = newModel => this.setState({ model: newModel });
    let initModel = new Cortex(initModelVal, onModelUpdate);
    return { model: initModel };
  },
  render() {
    return (
      <div>
        <Counter model={this.state.model.count} />
        <Counter model={this.state.model.count} />
      </div>
    );
  },
});
```

```
let TwoCountersShare = createClass({
  getInitialState() {
    let initModelVal = {
      count: counterInit()
    };
    let onModelUpdate = newModel => this.setState({ model: newModel });
    let initModel = new Cortex(initModelVal, onModelUpdate);
    return { model: initModel };
  },
  render() {
    return (
      <div>
        <Counter model={this.state.model.count} />
        <Counter model={this.state.model.count} />
      </div>
    );
  },
});
```

在 getInitialState 内，这两个组件的代码除了 initModelVal，其他完全一样。我们可以将这个部分通过一个函数封装起来。

```
let createModelHolder = function(Component, initModelVal) {
  return createClass({
    getInitialState() {
      let onModelUpdate = newModel => this.setState({ model: newModel });
      let initModel = new Cortex(initModelVal, onModelUpdate);
      return { model: initModel };
    },
    render() {
      return <Component model={this.state.model} />;
    },
  });
};
```

有了 createModelHolder 函数，我们代码修改成这样：

```diff
+ let TwoCountersNoShareInit = function() {
+   return {
+     countA: counterInit(),
+     countB: counterInit(),
+   };
+ };

let TwoCountersNoShare = createClass({
-  getInitialState() {
-    let initModelVal = {
-      count: counterInit()
-    };
-    let onModelUpdate = newModel => this.setState({ model: newModel });
-    let initModel = new Cortex(initModelVal, onModelUpdate);
-    return { model: initModel };
-  },
  render() {
    return (
      <div>
+       <Counter model={this.props.model.countA} />
+       <Counter model={this.props.model.countB} />
-       <Counter model={this.state.model.count} />
-       <Counter model={this.state.model.count} />
      </div>
    );
  },
});

+ TwoCountersNoShare = createModelHolder(TwoCountersNoShare, TwoCountersNoShareInit());
```

```diff
+ let TwoCountersShareInit = function() {
+   return {
+     count: counterInit()
+   };
+ };

let TwoCountersShare = createClass({
-  getInitialState() {
-    let initModelVal = {
-      count: counterInit()
-    };
-    let onModelUpdate = newModel => this.setState({ model: newModel });
-    let initModel = new Cortex(initModelVal, onModelUpdate);
-    return { model: initModel };
-  },
  render() {
    return (
      <div>
+      <Counter model={this.props.model.count} />
+      <Counter model={this.props.model.count} />
-      <Counter model={this.state.model.count} />
-      <Counter model={this.state.model.count} />
      </div>
    );
  },
});

TwoCountersShare = createModelHolder(TwoCountersShare, TwoCountersShareInit());
```

修改后的 TwoCounters 包含一个 init 函数和一个 react 组件，除了在最后调用了 createModelHolder 之外，跟我们的 Counter 有一模一样的结构。也就是说，如果我们不在这两个 TwoCounters 上调用 createModelHolder，那么它们就可以像 Counter 一样被其他组件应用。

如果我们在 app 的最上一层，也就是 reactDOM.render 时才调用 createModelHolder，那么我们 app 里的所有组件都是可高度复用的。

**到这里，你已经了解了如何用数据指针编写高度复用的组件。并且自己实现了 createModelHolder ———— rce 最重要的 api**

[下一章](https://github.com/blackChef/rce/blob/chinese-doc/tutorial/createComponent.md)



