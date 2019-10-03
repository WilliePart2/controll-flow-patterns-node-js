/**
 * Class implement task runner with concurrency limit
 */
class JobQueue {
  constructor(concurrency) {
    this.concurrency = concurrency;
    this.queue = [];
    this.running = 0;
  }

  next() {
    while (this.running < this.concurrency && this.queue.length) {
      const queue = this.queue.shift();
      // important increment counter before tusk running
      // in case of nested task registration
      this.running++;
      queue().then(() => {
        this.running--;
        this.next();
      });
    }
  }

  addTask(task) {
    this.queue.push(task);
    this.next();

    return this;
  }
}

/**
 * Run the code =)
 */
const jobQueue = new JobQueue(1)
  .addTask(() => {
    return new Promise((resolve, reject) => {
      console.log('task 1');
      setTimeout(resolve, 1000);
    });
  })
  .addTask(() => {
    return new Promise((resolve, reject) => {
      jobQueue.addTask(() => {
        return new Promise((resolve, reject) => {
          console.log('task 3');
          setTimeout(resolve, 1000);
        });
      });

      console.log('task 2');
      setTimeout(resolve, 1000);
    });
  });
