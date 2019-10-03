/**
 * Assigning listener to 'data' event turn stream into flowing mode
 * We could pause emitting data-chunks by invoking stream.pause() method
 * Calling stream.pause() method doesn't disable flowing mode
 */
process.stdin.on('data', (dataChunk) => {
  console.log(`Message size: ${dataChunk.length}\nMessage: ${dataChunk.toString()}`);
});
