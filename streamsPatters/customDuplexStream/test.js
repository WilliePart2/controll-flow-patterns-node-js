const fs = require('fs');
const duplex = require('./index');
const filename = 'test_.txt';
const destination = 'dest.txt';

const readable = fs.createReadStream(filename);
const writable = fs.createWriteStream(destination);


const duplexStream = duplex({ propagateErrors: true }, readable, writable);

duplexStream.pipe(writable)
  .on('end', () => console.log('end duplex reading'))
  .on('finish', () => console.log('finish duplex writing'));

duplexStream.on('error', () => console.log('duplex error'));
