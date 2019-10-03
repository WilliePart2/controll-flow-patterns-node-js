const http = require('http');
const zlib = require('zlib');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
  const filename = req.headers.filename;

  req
    .pipe(
      zlib.createGunzip()
        .on('error', () => console.log('error in zlib'))
    )
    .pipe(fs.createWriteStream(path.resolve(__dirname, `./${filename}`)))
    .on('finish', () => {
      res.end('All data fetched');
    })
    .on('error', () => {
      res.end('Error happen');
    });
});

const port = 3400;
server.listen(port, () => {
  console.log(`Server listen on ${port} port`);
});
