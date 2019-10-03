/**
 * Class implement 'job queue' pattern
 * The main responsibility of this class is limit amount of tasks what execute concurrently
 *
 * Class follow single responsibility principle
 * Its area of responsibility is run tasks and that is all
 */

class AsyncJobQueue {
  constructor(concurrency) {
    this.concurrency = concurrency;
    this.queue = [];
    this.running = 0;
  }

  execute() {
    while (this.running < this.concurrency && this.queue.length) {
      // important to increase counter before run task body
      // in case of dynamic task registration
      this.running++;

      const currentTask = this.queue.shift();
      currentTask(() => {
        this.running--;
        this.execute();
      });
    }
  }

  addTask(task) {
    this.queue.push(task);
    this.execute();
    return this;
  }
}

/**
 * Run code =)
 */

const queue = new AsyncJobQueue(1)
  .addTask((done) => {
    console.log('task 1');
    setTimeout(done, 1000);
  })
  .addTask((done) => {
    console.log('task 2');
    setTimeout(done, 1000);
  })
  .addTask((done) => {
    queue.addTask((doneDynamic) => {
      console.log('dynamic tasks');
      setTimeout(doneDynamic, 1000);
    });

    console.log('task 3');
    setTimeout(done, 1000);
  });
