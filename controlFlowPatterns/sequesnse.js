/**
 * Will compose functions to run from top to bottom
 * will pas result from previous function as result to next function
 * @param callbacks
 * @returns {*|(function(...[*]): *)}
 */
const sequence = (...callbacks) => callbacks.reverse()
  .reduce((callSequence, newCb) => (...args) => newCb(...args, callSequence), null);

/**
 * Run code =)
 */

sequence(
  one,
  two,
  final
)(0);

function one(args, cb) {
  console.log(args, cb);
  cb(args + 1);
}

function two(args, cb) {
  console.log(args, cb);
  cb(args + 1);
}

function final(sum, cb) {
  console.log(sum, cb);
}

/**
 * Iterating over list of tasks
 * Common pattern to iterate over list of tasks
 * or invoke some asynchronous operation for each item of list
 *
 * Conclusion:
 * Common pattern for running asynchronous operation in sequence
 */
function iterator(tasks, callback, index = 0, args) {
  if (index === tasks.length) {
    return callback();
  }

  tasks[index](
    args || undefined,
    result => iterator(tasks, callback, index + 1, result),
  );
}

/**
 * Test iterator
 */
iterator([
  task1,
  task2
], () => console.log('all the tasks completed'));

function task1({ n = 10, n1 = 1 } = {}, cb) {
  console.log(`task 1: ${n} + ${n1}`);
  cb({ n: n +1, n1: n1 + 1});
}

function task2({ n, n1 }, cb) {
  console.log(`task 2: ${n} + ${n1}`);
  cb();
}
