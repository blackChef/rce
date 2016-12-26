import insert from './insert.jsx';


// array node -> value | values -> ()
let append = function(node, newItems) {
  let curNodeVal = node.$val();
  let curNodeValLength = curNodeVal.length;

  return insert(node, curNodeValLength, newItems);
};

export default append;