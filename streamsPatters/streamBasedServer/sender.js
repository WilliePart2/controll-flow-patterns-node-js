const http = require('http');
const zlib = require('zlib');
const fs = require('fs');
const path = require('path');
const filename = process.env[2];

const requestOptions = {
  hostname: 'localhost',
  port: 3400,
  path: '/',
  method: 'PUT',
  headers: {
    filename: 'unzipped.txt',
    'Content-Type': 'application/octet-stream',
    'Content-Encoding': 'gzip'
  }
};

const request = http.request(requestOptions, (err, data) => {
  console.log('Data received from client' + data);
});

fs.createReadStream(path.resolve(__dirname, './source.txt'))
  .pipe(zlib.createGzip())
  .pipe(request)
  .on('finish', () => {
    console.log('File was successfully send');
  });
