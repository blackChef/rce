import insert from './insert.jsx';


// array node -> newItem | [newItems] -> ()
let append = function(node, newItems) {
  return insert(node, node.$toArray().length, newItems);
};

export default append;