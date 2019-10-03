/**
 * Randomly concatenate streams
 * @param {ReadStream[]} sourceStreams
 * @param {WriteStream} destination
 */
const randomMerge = (sourceStreams, destination) => {
  let completed = 0;
  const onEnd = () => {
    if (++completed === sourceStreams.length) {
      destination.end();
    }
  };

  sourceStreams.forEach(stream => {
    stream.pipe(destination, { end: false });
    stream.on('end', onEnd);
  });
};

/**
 * Concatenate data from source streams into destination stream
 * @param {ReadableStream[]} sourceStreams
 * @param {WritableStream} destination
 * @returns {WritableStream}
 */
const sequentialMerge = (sourceStreams, destination) => {
  let index = 0;
  const run = () => {
    const stream = sourceStreams[index++];

    if (!stream) {
      return destination.end();
    }

    stream.pipe(destination, { end: false });
    stream.on('close', run);
    stream.on('error', err => destination.emit('error', err));
  };
  run();

  return destination;
};

module.exports = {
  randomMerge,
  sequentialMerge,
};
