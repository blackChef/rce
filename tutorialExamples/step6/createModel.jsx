let createModel = function(initVal, onUpdate) {
  let model = {};

  for (let key in initVal) {
    model[key] = {
      __curVal__: initVal[key],
      val() {
        return this.__curVal__;
      },
      set(newVal) {
        this.__curVal__ = newVal;
        onUpdate(model);
      }
    };
  }

  console.log(model);
  return model;
};

export default createModel;