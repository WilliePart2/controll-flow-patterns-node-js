const {
  BODY_LENGTH_SIZE,
  TYPE_SIZE
} = require('./constants');
/**
 * Protocol description:
 * 1 byte identifier of package type
 * next 4 byte information about body length
 * next body with length described by previous 4 bytes
 *
 * Combine multiple streams into one
 */
const multiplixer = (sourceStreams, destination) => {
  Object.keys(sourceStreams).forEach((CHANEL_TYPE) => {
    const stream = sourceStreams[CHANEL_TYPE];

    stream.on('readable', () => {
      let chunk;
      while ((chunk = stream.read()) !== null) {
        const dataLength = chunk.length;
        /**
         * Allocate data for buffer
         */
        const tmpBuff = new Buffer(
          TYPE_SIZE + BODY_LENGTH_SIZE + dataLength
        );
        /**
         * Write package type
         * Package type takes 1 byte of size
         */
        tmpBuff.writeUInt8(parseInt(CHANEL_TYPE, 10), 0);
        /**
         * Write body length
         * body length takes 4 byte of size
         */
        tmpBuff.writeUInt32BE(dataLength, TYPE_SIZE);
        /**
         * Copy data retrieved from source stream to package
         */
        chunk.copy(tmpBuff, TYPE_SIZE + BODY_LENGTH_SIZE);
        /**
         * Send package
         */
        console.log(`Send message in package: ${tmpBuff.toString('utf8')}`)
        destination.write(tmpBuff);
      }
    });

    let finishedCount = 0;
    const onEnd = () => {
      if (++finishedCount === sourceStreams.length) {
        destination.end();
      }
    };

    stream.on('end', onEnd);
  });
};

module.exports = multiplixer;
