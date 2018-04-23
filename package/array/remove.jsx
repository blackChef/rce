let remove = function(node, predicate) {
  let newVal = node.val().filter(function(...args) {
    return !predicate(...args);
  });

  node.set(newVal);
};

export default remove;

