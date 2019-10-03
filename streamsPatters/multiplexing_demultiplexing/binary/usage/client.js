const net = require('net');
const multiplexer = require('../multiplexer');
const { STD_CHANEL, LOG_CHANEL, SERVER_PORT } = require('../constants');

console.log('Await please. Connection establishing...');
const chanel = net.connect(SERVER_PORT, () => {
  console.log('Connection established you could start messaging');
  multiplexer({
    [STD_CHANEL]: process.stdin,
    // [LOG_CHANEL]: process.stdin,
  }, chanel);
});
