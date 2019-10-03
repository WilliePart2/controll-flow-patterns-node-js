/**
 * Make thunk from function
 * 'Thunk' then could be used in generator based asynchronous control flow patterns
 */

const createThunk = (fn) =>
  (...args) =>
    cb => {
      args.push(cb);
      fn(...args);
    };

module.exports = {
  createThunk,
};
