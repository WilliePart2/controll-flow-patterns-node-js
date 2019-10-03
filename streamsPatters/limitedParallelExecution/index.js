const stream = require('stream');
const { createSourceFromArray } = require('../streamHelpers/createSourceStream');

class LimitedParallel extends stream.Transform {
  constructor(concurrency, transformFn) {
    super({ objectMode: true });
    this.running = 0;
    this.concurrency = concurrency;
    this.transformFn = transformFn;
    this.continueCallback = null;
    this.finalyzeCallback = null;
  }

  _transform(data, encoding, callback) {
    this.running++;
    this.transformFn(data, encoding, this._onComplete.bind(this));

    if (this.running < this.concurrency) {
      callback();
    } else {
      this.continueCallback = callback;
    }
  }

  _flush(callback) {
    if (this.running) {
      this.finalyzeCallback = callback;
    } else {
      callback();
    }
  }

  _onComplete(err) {
    this.running--;
    if (err) {
      return this.emit('error', err);
    }

    // this is necessary otherwise JS garbage collector will kill function object
    const tmpCb = this.continueCallback;
    this.continueCallback = null;
    tmpCb && tmpCb();
    if (this.running === 0) {
      this.finalyzeCallback && this.finalyzeCallback();
    }
  }
}

createSourceFromArray([1, 2, 3, 4, 5])
  .pipe(new LimitedParallel(1, (number, _, done) => {
    console.log(number);
    setTimeout(done, 500);
  }));
