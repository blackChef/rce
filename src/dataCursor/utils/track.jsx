import curry from 'lodash/curry';

let track = function(tag, input) {
  // debugger
  console.log(tag, input);
  return input;
};

export default curry(track);