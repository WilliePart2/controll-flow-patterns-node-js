const net = require('net');
const fs = require('fs');
const demultiplex = require('../demultiplexer');
const { STD_CHANEL, LOG_CHANEL, SERVER_PORT } = require('../constants');

const server = net.createServer((socket) => {
  // const log1 = fs.createWriteStream('std_logs.txt');
  demultiplex(socket, {
    [STD_CHANEL]: process.stdout,
    // [LOG_CHANEL]: process.stdout,
  });
});

server.listen(SERVER_PORT, () => {
  console.log(`Server listen on: ${SERVER_PORT}`);
});
