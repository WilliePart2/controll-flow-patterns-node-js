const { TYPE_SIZE, BODY_LENGTH_SIZE } = require('./constants');

/**
 * Unpack one stream into multiple streams
 * Each stream subscribe to data correspond to 'chanel type'
 */
const demultiplexer = (sourceStream, destinationStreams) => {
  let currentChanel = null;
  let currentLength = null;
  let currentBody = null;

  sourceStream.on('readable', () => {
    if (currentChanel === null) {
      const chunk = sourceStream.read(TYPE_SIZE);
      currentChanel = chunk && chunk.readUInt8(0);
    }

    if (currentLength === null) {
      const chunk = sourceStream.read(BODY_LENGTH_SIZE);
      currentLength = chunk && chunk.readUInt32BE(0);
    }

    // in case of invalid body length
    if (!currentLength) {
      return;
    }

    if (currentBody === null) {
      const chunk = sourceStream.read(currentLength);

      currentBody = chunk && chunk.toString();
    }

    // in case of invalid body
    if (!currentBody) {
      return;
    }

    const destination = destinationStreams[currentChanel];
    if (!destination) {
      return;
    }

    destination.write(currentBody);
    currentChanel = null;
    currentLength = null;
    currentBody = null;
  });

  sourceStream.on('end', () => {
    Object.keys(destinationStreams)
      .forEach(CHANEL_KEY => destinationStreams[CHANEL_KEY].end());
  });
};

module.exports = demultiplexer;
