const stream = require('stream');

class AppendStream extends stream.Transform {
  constructor(key, options) {
    super(options);
    this.ivKey = key;
  }

  _transform(chunk, encoding, callback) {
    this.ivKey && this.push(this.ivKey);
    this.ivKey = null;

    this.push(chunk, encoding);
    callback();
  }

  _flush(callback) {
    callback();
  }
}

module.exports = (key, options) => new AppendStream(key, options);
module.exports.AppendStream = AppendStream;
