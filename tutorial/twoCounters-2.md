# Two counters, different state

[上一章](https://github.com/blackChef/rce/blob/chinese-doc/tutorial/twoCounters-1.md)

在上一章里，我们成功的把 init，increase 和 decrease 还给了 Counter。新的 Counter 组件比之前的复用性更高了。

接下来，我们写一个新的 TwoCountersNoShare 组件。在这个组件里，两个 Counter 之间是独立的。

我们的 Counter 组件不需要任何修改。我们只要在 TwoCountersNoShare 内分配 state，为 state 里不同的部分编写 update 函数就行了。

```
let TwoCountersNoShare = createClass({
  getInitialState() {
    return {
      countA: counterInit(),
      countB: counterInit(),
    };
  },
  setCountA(newCount) {
    this.setState({ countA: newCount });
  },
  setCountB(newCount) {
    this.setState({ countB: newCount });
  },
  render() {
    return (
      <div>
        <Counter count={this.state.countA} setCount={this.setCountA} />
        <Counter count={this.state.countB} setCount={this.setCountB} />
      </div>
    );
  },
});
```

### 数据指针

尽管我们的 Counter 得到了重用，上面的代码还是有让我们困扰的地方：

每在 state 内增加一个新的部分，我们就得为那个部分写一个 set 函数。

既然 state 里的数据总是需要一个 set 函数，那么能不能在 state 内保存一种自带 set 方法的数据呢？


createModel 函数，为对象里的值增加 val 和 set 方法：

```
let createModel = function(initVal, onUpdate) {
  let model = {};
  for (let key in initVal) {
    model[key] = {
      __curVal__: initVal[key],

      // 读取
      val() {
        return this.__curVal__;
      },

      // 更新之后调用 onUpdate
      set(newVal) {
        this.__curVal__ = newVal;
        onUpdate(model);
      }
    };
  }

  return model;
};
```

利用 createModel 函数创建的新数据结构，我们的 TwoCountersNoShare 可以不用单独为 state 的不同部分写 set 函数了。

```diff
let TwoCountersNoShare = createClass({
  getInitialState() {
+    let initModelVal = {
+      countA: counterInit(),
+      countB: counterInit(),
+    };

+    // 数据更新时，调用组件的 setState，触发重新渲染。
+    let onModelUpdate = newModel => this.setState({ model: newModel });
+    let initModel = createModel(initModelVal, onModelUpdate);
+    return { model: initModel };
-    return {
-      countA: counterInit(),
-      countB: counterInit(),
-    };
  },
  render() {
    return (
      <div>
+       <Counter model={this.state.model.countA} />
+       <Counter model={this.state.model.countB} />
-       <Counter count={this.state.countA} setCount={this.setCountA} />
-       <Counter count={this.state.countB} setCount={this.setCountB} />
      </div>
    );
  },
});
```

Counter 可以直接调用 model 上的方法修改和读取数据：

```diff
let Counter = createClass({
  increase() {
+    this.props.model.set(this.props.model.val() + 1);
-    this.props.setCount(this.props.count + 1);
  },
  decrease() {
+    this.props.model.set(this.props.model.val() - 1);
-    this.props.setCount(this.props.count - 1);
  },
  render() {
    return (
      <div>
        <button type="button" onClick={this.decrease}>-</button>
+        <span>{this.props.model.val()}</span>
-        <span>{this.props.count}</span>
        <button type="button" onClick={this.increase}>+</button>
      </div>
    );
  },
});
```

之前编写的拥有两个 Counter 同步的组件修改成这样：

```diff
let TwoCountersShare = createClass({
  getInitialState() {
+    let initModelVal = {
+      count: counterInit()
+    };
+    let onModelUpdate = newModel => this.setState({ model: newModel });
+    let initModel = createModel(initModelVal, onModelUpdate);
+    return { model: initModel };
-    return { count: counterInit() };
  },
-  setCount(newCount) {
-   this.setState({ count: newCount });
-  },
  render() {
-    let counterProps = {
-      count: this.state.count,
-      setCount: this.setCount,
-    };

    return (
      <div>
+        <Counter model={this.state.model.count} />
+        <Counter model={this.state.model.count} />
-        <Counter {...counterProps}/>
-        <Counter {...counterProps}/>
      </div>
    );
  },
});
```

这种自带 set, val 方法的新数据结构被称作为数据指针。

通过数据指针，我们进一步将组件使用者的负担降低。现在 Counter 和 TwoCounters 的关系是这样的：

- Counter 提供 init，封装 increase 和 decrease。
- TwoCounters 为 Counter 以数据指针的形式保存 state。

[下一章](https://github.com/blackChef/rce/blob/chinese-doc/tutorial/twoCounters-3.md)


