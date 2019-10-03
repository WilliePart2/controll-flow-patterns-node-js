const { async } = require('./generatorWrapper');

/**
 * Class implements one of variations of producer-consumer algorithm
 * Producer it's external code what use this class
 * Consumer it's worker what will control task execution
 */
class ProducerConsumer {
  constructor(concurrency) {
    this.running = 0;
    this.concurrency = concurrency;
    this.taskQueue = [];
    this.consumerQueue = [];
    this.spawnWorkers();
  }

  spawnWorkers() {
    const self = this;
    while (this.running < this.concurrency) {
      async(function* () {
        while (true) {
          // get new task on put worker into await mode
          const task = yield self.getNextTask();
          // run task
          yield task;
        }
      });

      this.running++;
    }
  }

  getNextTask() {
    return callback => {
      if (this.taskQueue.length) {
        return callback(null, this.taskQueue.shift());
      }

      this.consumerQueue.push(callback);
    };
  }

  addTask(task) {
    if (this.consumerQueue.length) {
      // run pending worker
      this.consumerQueue.shift()(null, task);
      return this;
    }

    this.taskQueue.push(task);
    return this;
  }
}

/**
 * Run code =)
 */

const producerConsumer = new ProducerConsumer(1);
producerConsumer.addTask(task1)
  .addTask(task1);

function task1(callback) {
  console.log('task 1');
  setTimeout(callback, 1000);

  producerConsumer.addTask(callback => {
    console.log('nested task');
    setTimeout(callback, 1000);
  });
}
