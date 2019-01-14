'use strict'

const SerialPort = require('serialport');
const serial     = require('../config/serial');
const logger     = require('../controllers/logger');
const port       = new SerialPort(serial.device, serial.settings);
const Readline   = SerialPort.parsers.Readline;
const parser     = port.pipe(new Readline(serial.delimiter));

exports.error = function(callback) {
  port.on('error', function(err) {
    if (err) {
      logger.error('PORT ERROR', err.message);
      callback();
    }
  });

  port.on('open', function(err) {
    if (err) {
      logger.error('PORT ERROR', err.message);
      callback();
    }
  });

  port.on('close', function(err) {
    if (err) {
      logger.error('PORT ERROR', err.message);
      callback();
    }
  });
}

exports.read = function(callback) {
  parser.on('data', function (data) {
    data = data.replace(/[\n\r]/g, '');
    logger.debug('PORT DATA', data);
    callback(data);
  });
}

exports.open = function() {
  return new Promise((resolve, reject) => {
    port.open(function (err) {
      if (err) {
        logger.error('PORT ERROR', err.message);
        resolve(false);
      } else {
        logger.info('PORT OPEN');
        resolve(true);
      }
    });
  });
}

exports.close = function() {
  return new Promise((resolve, reject) => {
    port.close(function (err) {
      if (err) {
        logger.error('PORT ERROR', err.message);
        resolve(false);
      } else {
        logger.info('PORT CLOSE');
        resolve(false);
      }
    });
 });
}

exports.write = function(data) {
  logger.debug('PORT WRITE', data);
  port.write(data + serial.delimiter, function(err) {
    if (err) return logger.error('PORT WRITE', err.message);
  });
}
