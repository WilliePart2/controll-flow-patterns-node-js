const fs = require('fs');
const path = require('path');
const { EventEmitter } = require('events');

/**
 * Using event emitter just for emitting event
 * @param files
 * @param match
 */
function findMatch(files, regExpr) {
  const emitter = new EventEmitter();
  files.forEach(file => {
    fs.readFile(path.resolve(__dirname, file), 'utf8', (error, data) => {
      if (error) {
        return emitter.emit('error', error);
      }

      emitter.emit('fileRead', data);

      let match = data.match(regExpr);
      if (match) {
        match.forEach(matchedPiece => emitter.emit('match', matchedPiece));
      }
    });
  });

  return emitter;
}

/**
 * Use event emitter ad object with API
 * Useful for consuming api and for extending functionality
 */
class WordSearch extends EventEmitter {
  constructor(files, regExpr) {
    super();

    this.files = files;
    this.regExpr = regExpr;
  }

  addFile(filename) {
    this.files.push(filename);
    return this;
  }

  find() {
    this.files.forEach(filename => {
      fs.readFile(
        path.resolve(__dirname, filename),
        'utf8',
        (error, data) => {
          if (error) {
            return this.emit('error', error);
          }

          this.emit('fileRead', data);

          const match = data.match(this.regExpr);
          if (match) {
            match.forEach(matchPiece => {
              this.emit('match', matchPiece);
            });
          }
        }
      );
    });
  }
}

/**
 * Run code
 */

const contentSearch = findMatch(['./match.txt', './not_match.txt'], /match\s/)
  .on('error', (error) => console.error(`Error happen: ${error.message}`))
  .on('fileRead', (data) => console.log(`File content: ${data}`))
  .on('match', (match) => console.log(`Match peace of file: ${match}`));

const searchClass = new WordSearch(['./match.txt', './not_match.txt'], /match\s/)
  .on('error', (error) => console.error(`Error happen: ${error.message}`))
  .on('fileRead', (data) => console.log(`File content: ${data}`))
  .on('match', (match) => console.log(`Match peace of file: ${match}`))
  .find();
