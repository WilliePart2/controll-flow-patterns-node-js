const stream = require('stream');

/**
 * Here we create helper functions for creating streams.
 * It cover principle 'small surface area'.
 *
 * It becomes very easy and straightforward
 * to create source stream of transform stream in our code now
 */

/**
 * Create stream from array of any type except null
 * @param {Array}dataArray
 */
const createSourceFromArray = (dataArray) => {
  let index = 0;

  class ObjectStreamWrapper extends stream.Readable {
    constructor() {
      super({ objectMode: true });
    }

    _read(size) {
      this.push(dataArray[index++] || null);
    }
  }

  return new ObjectStreamWrapper();
};

const createTransformStream = (transformFn, flushFn, {
  readableObjectMode = true,
  writableObjectMode = true
} = {}) => {
  class TransformStreamWrapper extends stream.Transform {
    constructor() {
      super();

      if (readableObjectMode !== undefined) {
        this._readableState.objectMode = readableObjectMode;
      }

      if (writableObjectMode !== undefined) {
        this._writableState.objectMode = writableObjectMode;
      }
    }

    _transform(chunk, encoding, callback) {
      transformFn(chunk, encoding, chunk => {
        this.push(chunk);
        callback();
      });
    }

    _flush(callback) {
      if (flushFn) {
        flushFn(callback);
      }
    }
  }

  return new TransformStreamWrapper();
};

module.exports = {
  createSourceFromArray,
  createTransformStream,
};
