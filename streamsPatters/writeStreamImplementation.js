const stream = require('stream');
const fs = require('fs');
const path = require('path');

class WriteToFile extends stream.Writable {
  /**
   * Options what could be passed in the constructor of Writable stream
   * decodeStrings: boolean - decode strings into Buffers or not
   * objectMode: boolean - turn stream from binary mode to object mode
   * highWaterMark: number - stream buffer size
   */
  constructor() {
    super({ objectMode: true });
  }

  /**
   * This function is neccesary to implement for writable streams
   * @param chunk - in object mode will be an object
   * @param encoding
   * @param callback
   * @private
   */
  _write(chunk, encoding, callback) {
    const pathToFile = chunk.path;
    const content = chunk.content;
    fs.writeFile(path.resolve(__dirname, pathToFile), content, callback);
  }
}

const wtf = new WriteToFile();
wtf.write({ path: './new_test.txt', content: 'Hello test' });
