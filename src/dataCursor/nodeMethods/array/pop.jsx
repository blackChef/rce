import remove from './remove.jsx';

let pop = function(node) {
  remove(node, function(val, index, length) {
    return index === length - 1;
  });
};

export default pop;