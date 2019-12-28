const stream = require('stream');

/**
 * Class generate random string sequence
 * Good for overload some server via arrived data
 */
class FillString extends stream.Readable {
  /**
   * @param {number} targetSize
   * @param {{
   *   encoding: string,
   *   objectMode: boolean,
   *   highWaterMark: number
   * }} options
   */
  constructor(targetSize, options) {
    super(options);
    this.targetSize = targetSize;
    this.alreadyGenerated = 0;
    this.isBackPresure = false;
  }

  /**
   * Internal method what will be invoked to fill internal buffer(readable buffer)
   * @param size
   * @private
   */
  _read(size) {
    this._produceString();
  }

  _produceString() {
    const str = 'a'.repeat(1024 * 17); // generate 17Kb of data
    this.alreadyGenerated += Buffer.from(str).length;

    /**
     * Handle back-pressure
     * When we fill internal buffer _read() method will not invoked until this buffer will be flushed
     */
    if (!this.push(str)) {
      console.log('Back pressure happened');
    }

    // handle end of stream
    if (this.alreadyGenerated >= this.targetSize) {
      console.log('Filled all needed bytes');
      this.push(null);
    }
  }
}

const fillStr = new FillString(1024 * 100);
// turn stream into flowing mode
/*
fillStr.on('data', (chunk) => {
  console.log(`Generated string length: ${chunk.length}`);
});
*/

// Read data without turning stream into flush mode
fillStr.on('readable', () => {
  console.log('new data is available');
  const data = fillStr.read();
});

