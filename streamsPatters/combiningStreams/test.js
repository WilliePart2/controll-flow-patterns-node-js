const fs = require('fs');
const combine = require('./index');

const readable = fs.createReadStream('test.txt');
const writable = fs.createWriteStream('dest.txt');

combine(readable)
  .pipe(writable);
