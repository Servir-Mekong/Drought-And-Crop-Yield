'use strict';

const fs = require('fs'),
      util = require('util'),
      logFile = fs.createWriteStream('console.log.txt', { flags: 'a' });

// Or 'w' to truncate the file every time the process starts.
const logStdout = process.stdout;

var console_log = function () {
	logFile.write(util.format.apply(null, arguments) + '\n');
	logStdout.write(util.format.apply(null, arguments) + '\n');
};
var console_error = console_log;

module.exports = {
    console_log: console_log,
    console_error: console_error
};
