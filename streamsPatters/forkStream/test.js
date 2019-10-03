const fs = require('fs');
const fork = require('./index');

const readable = fs.createReadStream('test.txt');
const destination1 = fs.createWriteStream('dest1.txt');
const destination2 = fs.createWriteStream('dest2.txt');

fork([
  destination1,
  destination2
], readable);
