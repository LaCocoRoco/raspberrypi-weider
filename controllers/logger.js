'use strict'

const loglevel = require('loglevel');

loglevel.setLevel(parseInt(process.env.LOG_LEVEL || 0));

const trace = loglevel.trace;
const debug = loglevel.debug;
const info  = loglevel.info;
const warn  = loglevel.warn;
const error = loglevel.error;

loglevel.trace = function (a, b) {
  trace(b === undefined ? a : a + ' | ' + b);
}

loglevel.debug = function (a, b) {
  debug(b === undefined ? a : a + ' | ' + b);
}

loglevel.info = function (a, b) {
  info(b === undefined ? a : a + ' | ' + b);
}

loglevel.warn = function (a, b) {
  warn(b === undefined ? a : a + ' | ' + b);
}

loglevel.error = function (a, b) {
  error(b === undefined ? a : a + ' | ' + b);
}

module.exports = loglevel;
