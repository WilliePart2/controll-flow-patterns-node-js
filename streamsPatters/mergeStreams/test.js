const fs = require('fs');
const { sequentialMerge, randomMerge } = require('./index');

const read1 = fs.createReadStream('source1.txt');
const read2 = fs.createReadStream('source2.txt');

const randomDest = fs.createWriteStream('random.txt');
const sequentialDest = fs.createWriteStream('sequential.txt');

// randomMerge([
//   read1,
//   read2
// ], randomDest);

sequentialMerge([
  read2,
  read1,
], sequentialDest);
