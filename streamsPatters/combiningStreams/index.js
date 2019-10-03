const { EventEmitter } = require('events');
const stream = require('stream');
const duplex = require('../customDuplexStream');

/**
 * Simple implementation of combined stream with error propagation
 *
 * Inspired by multipipe npm package
 * https://www.npmjs.com/package/multipipe
 */
const combine = (...streams) => {
  const firstStream = streams[0];
  const lastStream = streams[streams.length - 1];

  /**
   * If stream only one we just return readable stream
   * 'wrap' method used to ensure that stream will be readable in 100%
   */
  if (streams.length === 1) {
    return new stream.Readable().wrap(firstStream);
  }

  /**
   * For several streams
   * We combine first and last streams
   * first stream is no important here but last is important
   * to last stream we will pipe previous stream
   * and to last stream will connect other streams which will use our combined stream
   * @type {DuplexWrapper}
   */
  const tunnel = duplex(
    { propagateErrors: true },
    firstStream,
    lastStream,
  );

  streams.forEach((stream, index) => {
    const next = streams[index + 1];
    if (next) {
      stream.pipe(next);
      next.on('error', (err) => tunnel.emit('error',err));
    }
  });

  return tunnel;
};

module.exports = combine;
