const crypto = require('crypto');

const generateRandomBytes = (size) => crypto.randomBytes(size);

module.exports = generateRandomBytes;
