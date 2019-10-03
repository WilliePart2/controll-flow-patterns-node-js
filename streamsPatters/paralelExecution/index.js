const stream = require('stream');
const { createSourceFromArray } = require('../streamHelpers/createSourceStream');

/**
 * This class handle each piece of stream data in parallel
 * It means that it doesn't wait until until previous chunk will be handled
 * So such type of stream is bad for work with binary data but could be very useful for work with objects
 *
 * It's like HUB it receive input from one source and trigger many other sources
 * Something similar to event emitter
 */

class ParallelTransform extends stream.Transform {
  constructor(transformFn) {
    super({ objectMode: true });
    this.transformFn = transformFn;
    this.running = 0;
    this.finylizeFn = null;
  }

  _transform(chunk, encoding, callback) {
    this.running++;
    this.transformFn(
      chunk,
      encoding,
      this.push.bind(this),
      this._onComplete.bind(this)
    );
    callback();
  }

  _flush(done) {
    // delay 'end' event emitting
    if (this.running) {
      return this.finylizeFn = done;
    }

    done();
  }

  _onComplete(err) {
    this.running--;

    if (err) {
      return this.emit('error', err);
    }

    // finish the stream and emit 'end' event
    if (this.running === 0) {
      this.finylizeFn && this.finylizeFn();
    }
  }
}

const transform = new ParallelTransform((number, encoding, push, done) => {
  console.log(`Input: ${number}`);
  push(++number);
  console.log(`Output: ${number}`);
  setTimeout(done, 1000);
});
createSourceFromArray([1, 2, 3, 4, 5])
  .pipe(transform)
  .on('data', data => console.log(`Received data: ${data}`))
  .on('end', () => console.log('Task handling finished'));
