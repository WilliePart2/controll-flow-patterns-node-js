/**
 * When we run parallel tasks is a good idea cary about race conditions
 * Race conditions arise from delay between completing tasks and invoking complete handler
 * Main approach to deal with race conditions is to use blocking
 */

/**
 * Wrapper for convenient setup parallel tasks execution
 * @param tasks
 * @param amountToRun
 * @param awaitToComplete
 * @param callback
 */
function parallel(tasks, awaitToComplete, callback) {
  /**
   * Core pattern to control parallel(concurrent) execution of tasks
   * @type {number}
   */
  let completeCounter = 0;
  let isFinished = false;
  const resultData = [];
  const resultError = [];
  tasks.forEach(task => task((err, data) => {
    if (isFinished) {
      return;
    }

    completeCounter += 1;
    if (err) {
      return resultError.push(err);
    }

    resultData.push(data);

    if (completeCounter === awaitToComplete || completeCounter === tasks.length) {
      isFinished = true;
      callback(resultError, resultData);
    }
  }));
}

/**
 * Shortcuts
 */
const parallelAll = (tasks, cb) => parallel(tasks, tasks.length, cb);
const parallelRace = (tasks, cb) => parallel(tasks, 1, cb);


/**
 * Test code =)
 */

parallelAll([
  task1,
  task2
], (errors, data) => console.log(data));

parallelRace([
  task1,
  task2,
], (error, data) => console.log(data));

function task1(cb) {
  console.log('task 1');
  setTimeout(() => cb(null, 1), Math.random() * 1000);
}

function task2(cb) {
  console.log('task 2');
  setTimeout(() => cb(null, 2), Math.random() * 1000);
}
