const fs = require('fs');
const {
  createSourceFromArray,
  createTransformStream,
} = require('../streamHelpers/createSourceStream');

const toFile = process.argv[2];
const fromFiles = process.argv.slice(3);
console.log(fromFiles);
const destinationStream = fs.createWriteStream(toFile);
createSourceFromArray(fromFiles)
  .pipe(createTransformStream((file, chunk, done) => {
    const src = fs.createReadStream(file);
    // wear but if we try to omit 'src' it will not work =(
    src.pipe(destinationStream, { end: false });
    src.on('end', done);
  }))
  .on('finish', () => console.log('Finish files combining'));
