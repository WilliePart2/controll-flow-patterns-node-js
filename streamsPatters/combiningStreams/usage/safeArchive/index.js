const fs = require('fs');
const zlib = require('zlib');
const crypto = require('crypto');
const combine = require('../../index');
const createCipherKey = require('./core/createCipherKey');
const createIVVector = require('./core/getRandomBytes');
const appendIVStream = require('./core/appendStream');

const [mode, filename, password] = process.argv.slice(2);

const IV_SIZE_BYTES = 16;

const MODE_COMPRESS = 'compress';
const MODE_COMPRESS_SHORT = 'c';

const MODE_DECOMPRESS = 'decompress';
const MODE_DECOMPRESS_SHORT = 'd';

const getFilename = file => `${file}.crypt.gzip`;

switch (mode) {
  case MODE_COMPRESS_SHORT:
  case MODE_COMPRESS: {
    const KEY = createCipherKey(password);
    const initializationVector = createIVVector(IV_SIZE_BYTES);

    combine(
      fs.createReadStream(filename),
      zlib.createGzip(),
      crypto.createCipheriv('aes256', KEY, initializationVector),
      appendIVStream(initializationVector),
      fs.createWriteStream(getFilename(filename), { encoding: 'utf8' })
    );
  } break;
  case MODE_DECOMPRESS_SHORT:
  case MODE_DECOMPRESS: {
    let IV = '';
    const targetFile = getFilename(filename);
    const ivStream = fs.createReadStream(targetFile, {
      end: IV_SIZE_BYTES - 1,
    });
    const KEY = createCipherKey(password);

    ivStream.on('data', data => IV = data);
    ivStream.on('close', () => {
      combine(
        fs.createReadStream(targetFile, { start: IV_SIZE_BYTES }),
        crypto.createDecipheriv('aes256', KEY, IV),
        zlib.createGunzip(),
        fs.createWriteStream(`uncompressed_${filename}`)
      )
        .on('error', (err) => {
          console.error(`Error happened while unzip/decrypt file: ${err.message}`);
          process.exit(1);
        });
    });

    ivStream.on('error', (err) => {
      console.error(`Error happened while read IV: ${err.message}`);
      process.exit(1);
    });
  } break;
}
