/**
 * We don't turn streams in flowing mode
 * in this case we should read data imperatively
 */

process.stdin.on('readable', () => {
  let chunk = process.stdin.read();
  while (chunk !== null) {
    console.log(`Message size is: ${chunk.length}`);
    chunk = process.stdin.read();
  }
})
  .on('finish', () => console.log('End of stream'));
