const stream = require('stream');

/**
 * This module is reimplementation of duplexer2 npm package
 * https://www.npmjs.com/package/duplexer2
 *
 * Reimplemented in education purposes =)
 */

class DuplexWrapper extends stream.Duplex {
  /**
   * @param {{
   *   propagateErrors: boolean
   * }} options
   * @param {Stream} readable
   * @param {Stream} writable
   */
  constructor(options, readable, writable) {
    super(typeof options === 'object' ? options : undefined);

    this._options = options;
    this._readable = readable;
    this._writable = writable;

    // if last argument is undefined then readable stream passed as first argument and writable as second
    if (writable === undefined) {
      this._readable = options;
      this._writable = readable;
      this._options = null;
    }

    // propagate errors
    // will allow us handle errors on our duplex stream
    if (options && options.propagateErrors) {
      this._readable.on('error', (err) => {
        // console.log('on error');
        this.emit('error', err);
      });
      this._writable.on('error', (err) => {
        // console.log('error');
        this.emit('error', err);
      });
    }

    /**
     * close readable side of stream wrapper
     * will cause emit 'end' event on the wrapper
     */
    this._readable.once('end', () => this.push(null));

    /**
     * close writable side of stream wrapper
     * will cause emit 'finished' event on the stream wrapper
     */
    this._writable.once('finish', () => this.end());

    /**
     * pass finalization to underlying writable stream
     * when someone invoke 'end()' event on the stream wrapper
     * this action will be passed to underlying writable stream
     */
    this.once('finish', () => this._writable.end());

    this._readable.on('readable', () => {
      this.__read();
    });
  }

  /**
   * We use readable stream as data source
   * so we just read from readable stream
   */
  __read() {
    let buffer;
    while ((buffer = this._readable.read()) !== null) {
      this.push(buffer);
    }
  }

  _read(size) {
    // mock method
    // required by API
  }

  /**
   * Just pass data to writable stream
   */
  _write(chunk, encoding, callback) {
    this._writable.write(chunk, encoding, callback);
  }
}

module.exports = (...args) => new DuplexWrapper(...args);
module.exports.DuplexWrapper = DuplexWrapper;
