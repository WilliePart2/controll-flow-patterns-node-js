/**
 * Pattern for controlled writing into stream
 * Callback will be invoked only when it's possible write next chunk of data
 */

const write = (stream, data, cb) => {
  if (!stream.write(data)) {
    stream.on('drain', cb);
  } else {
    process.nextTick(cb);
  }
};
