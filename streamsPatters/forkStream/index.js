const fs = require('fs');
const { EventEmitter } = require('events');

const fork = (destinationStreams, sourceStream) => {
  destinationStreams.forEach((destination) => {
    sourceStream.pipe(destination);
    destination.on('error', err => sourceStream.emit('error', err));
  });

  return sourceStream;
};

module.exports = fork;
