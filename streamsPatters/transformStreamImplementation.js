const stream = require('stream');

class ReplaceString extends stream.Transform {
  constructor(fromString, toString) {
    super();

    this.fromString = fromString;
    this.toString = toString;
    this.tail = '';
  }

  /**
   * Will be invoked wen external program write in stream
   * Should invoke push() to write data into internal buffer
   * @param chunk
   * @param encoding
   * @param callback
   * @private
   */
  _transform(chunk, encoding, callback) {
    const pieces = (this.tail + chunk.toString())
      .split(this.fromString);

    const lastPiece = pieces[pieces.length - 1];
    const lastPieceLength = this.toString.length - 1; // get length of almost all target word

    this.tail = lastPiece.slice(-lastPieceLength); // get piece of data what could be part of next chunk

    pieces[pieces.length - 1] = lastPiece.slice(0, -lastPieceLength); // write other data into 'store'
    this.push(pieces.join(this.toString));

    callback();
  }

  /**
   * Will be invoked when external program call stream.end()
   * @param callback - should be invoked to report that flushing is finished
   * @private
   */
  _flush(callback) {
    this.push(this.tail);
    this.tail = '';
    callback();
  }
}

const replace = new ReplaceString('Hello', 'Hi');
replace.on('end', () => console.log('replacement finished'));
let transformedData = '';
replace.on('data', (data) => {
  transformedData += data.toString();
});
replace.on('end', () => {
  console.log(transformedData);
});
replace.write('Hello ');
replace.write('world');
replace.end();
