/**
 * Function accept other function what expect callback as last argument
 * Return function wat result promise/A+
 */

const promisify = asynchronousFn =>
  (...args) => new Promise((onResolve, onReject) => {
    // handler what will be passed as callback
    args.push((err, ...result) => {
      if (err) {
        return onReject(err);
      }

      onResolve(...result);
    });

    asynchronousFn(...args);
  });

/**
 * Run the code =)
 */

const task1 = (cb) => {
  console.log('Task 1');
  setTimeout(cb, 1000);
};
const promisifiedTask = promisify(task1);
promisifiedTask().then(() => console.log('task 1 finished'))
  .catch(() => console.log('Error happen'));
