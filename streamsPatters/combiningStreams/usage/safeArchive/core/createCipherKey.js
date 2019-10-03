const crypto = require('crypto');

const createHash = (password) => crypto.createHash('sha256')
  .update(password)
  .digest();

module.exports = createHash;
