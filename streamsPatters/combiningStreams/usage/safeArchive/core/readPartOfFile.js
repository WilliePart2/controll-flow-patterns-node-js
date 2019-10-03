const fs = require('fs');

const readPartOfFile = ({ pathToFile, startPoint = 0, endPoint }) => {
  let fileData = '';
  return new Promise((resolve, reject) => {
    const readable = fs.createReadStream(pathToFile, {
      start: startPoint,
      end: endPoint,
    })
      .on('readable', () => {
        let chunk;
        while((chunk = readable.read()) !== null) {
          fileData += chunk.toString();
        }
      })
      .on('close', resolve)
      .on('error', reject);
  });
};
