const { createThunk } = require('./thunkPattern');

/**
 * Handling asynchronous code with generators
 */
function async (generatorFn) {
  const generator = generatorFn();
  checkResult(generator.next());

  function checkResult(iterator) {
    if (iterator.done) {
      return;
    }

    const entry = iterator.value;
    switch (typeof entry) {
      case 'function':
        entry((err, ...data) => {
          if (err) {
            return generator.throw(err);
          }

          checkResult(generator.next(...data));
        });
        break;
      case 'object':
        if (entry instanceof Promise) {
          return Promise.resolve(entry)
            .then(data => checkResult(generator.next(data)))
        }

        process.nextTick(() => checkResult(generator.next(entry)));
        break;
      default:
        process.nextTick(() => checkResult(generator.next(entry)));
    }
  }
}

const asyncTask = (data, cb) => {
  console.log(`Async task data: ${data}`);
  setTimeout(() => cb(null, 'hello from async task'), 1000);
};

const promiseTask = data => new Promise((resolve, reject) => {
  console.log(`Promise task data: ${data}`);
  setTimeout(() => resolve('Hello from promise task'), 1000);
});

const taskThunk = createThunk(asyncTask);

// async(function* () {
//   const firstData = yield 'Scalar data';
//   console.log(firstData);
//
//   console.log(
//     yield taskThunk('Data for async task')
//   );
//
//   console.log(
//     yield promiseTask('Data for promise task')
//   );
// });

module.exports = {
  async,
};
