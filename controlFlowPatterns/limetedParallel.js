/**
 * Function run tasks ab butch but limit their amount
 * In general in kind of combination sequential execution and execution as batch
 *
 * Top level function ack as wrapper for convenient running
 * Inner 'iterate' function perform tasks running in limited amount
 */

function runLimitedBatch(tasks, concurrencyLimit, onFinish) {
  let index = 0,
    running = 0,
    completed = 0;

  function iterate() {
    while (running < concurrencyLimit && index < tasks.length) {
      const currentTask = tasks[index];
      currentTask(() => {
        completed++;
        running--;

        if (completed === tasks.length) {
          return onFinish();
        }

        iterate();
      });

      running++;
      index++;
    }
  }

  iterate();
}

/**
 * Run code =)
 */
runLimitedBatch([
  (cb) => {
    console.log('task 1');
    setTimeout(cb, 1000);
  },
  (cb) => {
    console.log('task 2');
    setTimeout(cb, 2000);
  },
  (cb) => {
    console.log('task 3');
    setTimeout(cb, 100);
  },
], 2, () => console.log('All tasks completed'));

