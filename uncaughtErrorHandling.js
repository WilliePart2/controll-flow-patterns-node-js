const fs = require('fs');

/**
 * Correct function to read json files
 * could be better by the use of streams in order to prevent overwhelming of memory
 * @param filename
 * @param callback
 */
function readJSON(filename, callback) {
  fs.readFile(filename, 'utf8', (error, data) => {
    if (error) {
      return callback(error);
    }

    let fileContent = null;
    /**
     * For case if we try to read invalid JSON file
     * or file what doesn't exists
     */
    try {
      fileContent = JSON.parse(data);
    } catch (e) {
      return callback(e);
    }

    callback(null, fileContent);
  });
}

process.on('uncaughtException', (error) => {
  console.log(`
    Unhandled error happens =(
    ${error.message}
  `);

  process.exit(1);
});

/**
 * Incorrect reading of JSON file
 * Will fail if we try to read incorrect json file
 * @param filename
 * @param callback
 */
function readJSONBuggy(filename, callback) {
  fs.readFile(filename, 'utf8', (error, content) => {
    if (error) {
      return callback(error);
    }

    callback(null, JSON.parse(content));
  });
}

/**
 * Run our code =)
 * First function will finish correctly and handle error
 * Second one will cause script failure
 */

readJSON('invalidJSON.json', (error, file) => {
  if (error) {
    return console.error(error);
  }

  console.log(file);
});

readJSONBuggy('invalidJSON.json', (error, data) => {
  if (error) {
    return console.error(error);
  }

  console.log(data);
});
